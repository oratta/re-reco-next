import { STATUS as JOB_LISTING_STATUS } from "@/commons/models/JobListing";

export const mockData = {
    casts: [
        { id: '1', code: 'C001', name: 'Cast 1', groupId: '1', averageTotalCount: 10, totalReservationRate: 0.8, recent1ReservationRate: 0.9, recent5ReservationRate: 0.85, recent30daysReservationRate: 0.82, reservationUrl: 'http://example.com/cast1' },
        { id: '2', code: 'C002', name: 'Cast 2', groupId: '1', averageTotalCount: 8, totalReservationRate: 0.7, recent1ReservationRate: 0.8, recent5ReservationRate: 0.75, recent30daysReservationRate: 0.72, reservationUrl: 'http://example.com/cast2' },
    ],
    groups: [
        { id: '1', code: 'G001', name: 'Group 1', totalReservationRate: 0.75, recent1ReservationRate: 0.85, recent5ReservationRate: 0.8, recent30daysReservationRate: 0.77, reservationListUrl: 'http://example.com/group1' },
        { id: '2', code: 'G002', name: 'Group 2', totalReservationRate: 0.7, recent1ReservationRate: 0.8, recent5ReservationRate: 0.75, recent30daysReservationRate: 0.72, reservationListUrl: 'http://example.com/group2' },
    ],
    areas: [
        { id: '1', name: '渋谷', code: 'A001' },
        { id: '2', name: '新宿', code: 'A002' },
    ],
    jobListings: [
        { id: '1', status: 'completed', areaId: '1', targetDate: '2023-05-01', listCount: 5, condition: 'condition1', startedAt: '2023-04-30T10:00:00Z', completedAt: '2023-04-30T10:30:00Z' },
        { id: '2', status: 'in_progress', areaId: '2', targetDate: '2023-05-02', listCount: 3, condition: 'condition2', startedAt: '2023-05-01T09:00:00Z', completedAt: null },
    ],
    jobReservationRates: [
        { id: '1', status: 'completed', castId: '1', areaCode: 'A001', groupCode: 'G001', reservedRate: 0.8, reservedCount: 8, emptyCount: 2, totalCount: 10, jobListingId: '1', isLastList: false, startedAt: '2023-04-30T10:00:00Z', completedAt: '2023-04-30T10:15:00Z' },
        { id: '2', status: 'in_progress', castId: '2', areaCode: 'A002', groupCode: 'G001', reservedRate: 0.7, reservedCount: 7, emptyCount: 3, totalCount: 10, jobListingId: '2', isLastList: true, startedAt: '2023-05-01T09:00:00Z', completedAt: null },
    ],
    mockOrderList: [
        {
            id: 1,
            status: JOB_LISTING_STATUS.EXEC_RUNNING,
            areaName: 'Shibuya',
            targetDate: new Date(),
            isNow: true,
            listSize: 100,
            completeCount: 30,
            pendingCount: 70,
            failedCount: 0,
            startTime: new Date(Date.now() - 30 * 60000), // 30分前
            estimatedEndTime: new Date(Date.now() + 60 * 60000), // 1時間後
            queuePosition: null,
        },
        {
            id: 2,
            status: JOB_LISTING_STATUS.LIST_COMPLETED,
            areaName: 'Shinjuku',
            targetDate: new Date(Date.now() + 24 * 60 * 60000), // 明日
            isNow: false,
            listSize: 150,
            completeCount: 0,
            pendingCount: 150,
            failedCount: 0,
            startTime: null,
            estimatedEndTime: null,
            queuePosition: 1,
        },
        {
            id: 3,
            status: JOB_LISTING_STATUS.EXEC_COMPLETED,
            areaName: 'Ikebukuro',
            targetDate: new Date(Date.now() - 24 * 60 * 60000), // 昨日
            isNow: false,
            listSize: 80,
            completeCount: 78,
            pendingCount: 0,
            failedCount: 2,
            startTime: new Date(Date.now() - 2 * 60 * 60000), // 2時間前
            estimatedEndTime: new Date(Date.now() - 30 * 60000), // 30分前
            queuePosition: null,
        },
    ]
};