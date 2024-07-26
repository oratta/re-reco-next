import { v4 as uuidv4 } from 'uuid';

class JobManager {
    constructor() {
        this.jobs = [];
    }

    createJob(){
        const job = {
            id: uuidv4(),
            status: 'pending',
            createAt: new Date(),
        };
        this.jobs.push(job);
        return job.id;
    }

    async runJob(id){
        const job = this.jobs.find(j => j.id === id);
        if(!job) throw new Error('Job not found');

        job.status = 'running';
        job.startedAt = new Date();

        await new Promise(resolve => setTimeout(resolve, 5000));

        job.status = 'completed';
        job.completedAt = new Date();
        job.result = 'Job completed successfully';
    }

    getJobs() {
        return this.jobs;
    }

    getJob(id) {
        return this.jobs.find(j => j.id === id);
    }
}

export const jobManager = new JobManager();