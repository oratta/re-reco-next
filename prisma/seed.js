const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    // エリアデータの作成
    const areas = [
        { name: '五反田', code: 'tokyo/A1317/A131703'},
        { name: '渋谷', code: 'tokyo/A1303/A130301' },
        { name: '品川', code: 'tokyo/A1315/A131503' },
        { name: '池袋', code: 'tokyo/A1305/A130505-A130506' },
        { name: '名古屋', code: 'aichi/A2301/A230101' },
        { name: '新潟市', code: 'niigata/A1501/A150101' },
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