import { v4 as uuidv4 } from 'uuid';
import prisma from "@/commons/libs/prisma";

class JobManager {
    async createJob(){
        const job = await prisma.job.create({
            data: {
                status: 'pending',
            },
        })
        return job.id;
    }

    async runJob(id){
        if(!id) throw new Error('Job ID is required');
        let job = await prisma.job.findUnique({where: {id: id}})
        if(!job) throw new Error('Job not found');

        job = await prisma.job.update({
            where: {id},
            data: {status: 'running', startedAt: new Date()}
        });

        //TODO Implement Job task
        await new Promise(resolve => setTimeout(resolve, 5000));

        job = await prisma.job.update({
            where: {id},
            data: {
                status: 'completed',
                completedAt: new Date(),
                result: 'Job completed successfully'
            },
        })
    }

    async getJobs() {
        return prisma.job.findMany({orderBy: {createdAt: 'desc'}});
    }

    async getJob(id) {
        return prisma.job.findUnique({where: {id}});
    }
}

export const jobManager = new JobManager();