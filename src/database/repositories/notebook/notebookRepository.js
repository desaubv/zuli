import { getDatabase } from "database/database";
import notebookQueries from "./notebookQueries";

const NotebookRepository = new Object();

NotebookRepository.insertNotebook = async (title, color, icon) => {
    const db = await getDatabase();

    const result = await db.runAsync(
        notebookQueries.insertNotebook,
        [title, color, icon]
    );

    return result;
}

NotebookRepository.getNotebooks = async () => {
    const db = await getDatabase();
    const result = await db.getAllAsync(notebookQueries.getNotebooks);

    return result;
}

NotebookRepository.deleteNotebook = async (id) => {
    const db = await getDatabase();
    const result = await db.runAsync(notebookQueries.deleteNotebook, [id]);

    return result;
}

NotebookRepository.updateNotebook = async (id, title, color, icon) => {
    const db = await getDatabase();

    const result = await db.runAsync(
        notebookQueries.updateNotebook,
        [title, color, icon, id]
    );

    return result;
}
export default NotebookRepository;