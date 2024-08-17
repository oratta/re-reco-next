import prisma from "@/commons/libs/prisma";
import {consoleError} from "@/commons/utils/log";

export async function addArea({name, code}) {
    try{
        const area = await prisma.area.create({
            data: {
                code,
                name,
            },
        });
        return area;
    }catch(error){
        consoleError(error, "failed to create area", false);
        throw error;
    }
}

export async function createIfNot({name, code}) {
    try{
        const area = await prisma.area.upsert({
            where: {code: code},
            update: {},
            create: {
                name: name,
                code: code,
            },
        })
        return area;
    }catch (error){
        consoleError(error, "failed to create area", false);
        throw error;
    }
}