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