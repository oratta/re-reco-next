const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    // エリアデータの作成
    const areas = [
        { name: 'Tokyo', code: 'TKY' },
        { name: 'Osaka', code: 'OSK' },
        { name: 'Fukuoka', code: 'FUK' },
    ]

    for (const area of areas) {
        await prisma.area.upsert({
            where: { code: area.code },
            update: {},
            create: area,
        })
    }

    console.log('Seed data inserted successfully.')
}

main()
    .catch((e) => {
        console.error('Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })