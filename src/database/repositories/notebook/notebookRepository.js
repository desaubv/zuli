import { getDatabase } from "database/database";

const NotebookRepository = new Object();

NotebookRepository.insertNotebook = async(name, title, description, color, icon) => {
    const db = await getDatabase();

    const result = await db.execAsync(
        NotebookQueries.insertNotebook, 
        [name, title, description, color, icon]
    );

    return result;
}

export default NotebookRepository;