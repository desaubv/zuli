import { getDatabase } from "database/database";
import notebookQueries from "./notebookQueries";

const NotebookRepository = new Object();

NotebookRepository.insertNotebook = async(name, title, description, color, icon) => {
    const db = await getDatabase();

    const result = await db.execAsync(
        notebookQueries.insertNotebook, 
        [name, title, description, color, icon]
    );

    return result;
}

NotebookRepository.getNotebooks = async() => {
    const db = await getDatabase();
    const result = await db.getAllAsync(notebookQueries.getNotebooks);

    return result;
}

export default NotebookRepository;