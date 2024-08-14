import {NextResponse} from "next/server";
import {consoleError} from "@/commons/utils/log";

export async function DELETE(request,{params}) {
    try {
        const {id} = params;
        // Use prisma to delete the area with the provided id
        const deletedArea = await prisma.area.delete({
            where: {
                id: id
            }
        });

        // If successfully deleted, return a 200 status code with a message
        return NextResponse.json({message: 'Area deleted successfully'}, {status: 200});
    } catch (error) {
        const errorMessage = 'Failed to delete area';
        consoleError(error, errorMessage);

        // If error occurred, return a 500 status code with an error message
        return NextResponse.json({error: errorMessage, details: error.message}, {status: 500});
    }
}