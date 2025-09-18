const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🧪 Test progress system...');
  await prisma.$connect();

  // Ensure a user
  let user = await prisma.user.findFirst({ where: { email: 'progress@test.local' } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'progress@test.local',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq5S/kS', // password123
        firstName: 'Progress',
        lastName: 'Tester',
        role: 'STUDENT',
        emailVerified: true,
        isActive: true,
      },
    });
  }

  // Create formation + 2 modules
  const formation = await prisma.formation.create({
    data: {
      title: 'Formation Progress Test',
      description: 'Test progression via ItemProgress',
      shortDescription: 'Test progression',
      category: 'CYBERSECURITE',
      level: 'DEBUTANT',
      instructor: 'Bot',
      instructorId: user.id,
      duration: '2',
      status: 'PUBLISHED',
    },
  });

  const modA = await prisma.module.create({
    data: {
      title: 'Module A', description: 'A', duration: 30, type: 'TEXT', content: 'A', order: 0, formationId: formation.id,
    },
  });
  const modB = await prisma.module.create({
    data: {
      title: 'Module B', description: 'B', duration: 30, type: 'TEXT', content: 'B', order: 1, formationId: formation.id,
    },
  });

  // Enroll user
  const enrollment = await prisma.enrollment.create({
    data: { userId: user.id, formationId: formation.id }
  });

  // Initially no progress
  const before = await prisma.userProgress.findUnique({ where: { userId_formationId: { userId: user.id, formationId: formation.id } } });
  console.log('Before progress:', before);

  // Mark Module A completed via ItemProgress
  await prisma.itemProgress.upsert({
    where: { userId_moduleId: { userId: user.id, moduleId: modA.id } },
    update: { status: 'COMPLETED' },
    create: { userId: user.id, formationId: formation.id, moduleId: modA.id, status: 'COMPLETED' },
  });

  // Recalculate
  // Minimal recalc inline (mirror of library)
  const modules = await prisma.module.findMany({ where: { formationId: formation.id } });
  const ips = await prisma.itemProgress.findMany({ where: { userId: user.id, formationId: formation.id } });
  const completedStatuses = new Set(['COMPLETED', 'PASSED']);
  const map = new Map(ips.filter(i => i.moduleId).map(i => [i.moduleId, i]));
  let completed = 0;
  for (const m of modules) {
    const ip = map.get(m.id);
    if (ip && completedStatuses.has(ip.status)) completed++;
  }
  const pct = modules.length ? (completed / modules.length) * 100 : 0;
  await prisma.userProgress.upsert({
    where: { userId_formationId: { userId: user.id, formationId: formation.id } },
    update: { completedModules: completed, progressPercentage: pct },
    create: { userId: user.id, formationId: formation.id, completedModules: completed, progressPercentage: pct, startedAt: new Date() }
  });
  await prisma.enrollment.update({ where: { id: enrollment.id }, data: { progress: pct } });

  // Check progress
  const after = await prisma.userProgress.findUnique({ where: { userId_formationId: { userId: user.id, formationId: formation.id } } });
  const enr = await prisma.enrollment.findUnique({ where: { id: enrollment.id } });
  console.log('After progress:', after);
  console.log('Enrollment cache %:', enr.progress);

  // Cleanup
  await prisma.itemProgress.deleteMany({ where: { userId: user.id, formationId: formation.id } });
  await prisma.userProgress.deleteMany({ where: { userId: user.id, formationId: formation.id } });
  await prisma.enrollment.delete({ where: { id: enrollment.id } });
  await prisma.module.deleteMany({ where: { formationId: formation.id } });
  await prisma.formation.delete({ where: { id: formation.id } });

  console.log('✅ Progress system test completed');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
