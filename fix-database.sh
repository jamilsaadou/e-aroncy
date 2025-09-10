#!/bin/bash

echo "🔧 RÉPARATION BASE DE DONNÉES E-ARONCY"
echo "======================================"
echo "Problème: La colonne 'users.name' n'existe pas dans la base de données"
echo "Solution: Synchronisation Prisma + Base de données"
echo ""

echo "🚀 SOLUTION RAPIDE - Reset et Migration Complète"
echo "==============================================="

echo "1️⃣ Arrêt des services..."
docker-compose down

echo "2️⃣ Suppression de la base de données existante..."
docker volume rm $(docker volume ls -q | grep postgres) 2>/dev/null || true

echo "3️⃣ Redémarrage avec base de données fraîche..."
docker-compose up -d database

echo "4️⃣ Attente du démarrage de PostgreSQL..."
sleep 10

echo "5️⃣ Application des migrations Prisma..."
docker-compose exec database psql -U earoncy_user -d earoncy_db -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";" 2>/dev/null || true

# Générer et appliquer les migrations
docker-compose run --rm api npx prisma generate
docker-compose run --rm api npx prisma db push --force-reset

echo "6️⃣ Seed de la base de données..."
docker-compose run --rm api npx prisma db seed

echo "7️⃣ Redémarrage complet..."
docker-compose up -d

echo "✅ Base de données réparée !"
echo "🌐 Testez sur: http://localhost:3000"
echo "👤 Login: admin@earoncy.org / admin123"
