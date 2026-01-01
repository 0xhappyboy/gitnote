import { invoke } from '@tauri-apps/api/core';

export interface FileInfo {
    name: string;
    path: string;
    type: 'File' | 'Directory';
    extension?: string;
    size: number;
    modified: number;
    children: FileInfo[];
    depth: number;
}

const GET_DIRECTORY_TREE = "get_note_storage_directory_tree";

export async function getDirectoryTree(): Promise<FileInfo[]> {
    try {
        const treeJson: string = await invoke(GET_DIRECTORY_TREE);
        if (!treeJson) {
            throw new Error('No directory tree data returned');
        }
        try {
            return JSON.parse(treeJson);
        } catch (error) {
            throw new Error('Invalid directory tree data format');
        }
    } catch (error) {
        throw new Error('Failed to get directory tree');
    }
}