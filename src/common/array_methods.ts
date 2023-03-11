/** 
 * Imports 
 * @param manifest: The plugin's manifest
 * @param tryCallback: Function to wrap another function in a try-catch
 */
import { manifest } from '@vendetta/plugin';
import tryCallback from './try_callback';

const insertItem = (originalArray: any[], insert: any, insertIndex: number, label?: string): number => {
    return tryCallback(() => {
        if (!originalArray) return undefined
    
        originalArray.length++;
        insertIndex++;

        for (let i = originalArray.length - 1; i >= insertIndex; i--) {
            originalArray[i] = originalArray[i - 1];
        }

        originalArray[insertIndex - 1] = insert;

        return originalArray.length
    }, [originalArray, insert, insertIndex], manifest.name, "insert an item at", label)
}

const mapItem = <T>(array: T[], callback: any, label?: string): any[] => {
    return tryCallback(() => {
        let newArray = []

        for(let i = 0; i < array.length; i++) {
            insertItem(newArray, callback(array[i], i, array), newArray.length)
        }
        
        return newArray
    }, [array, callback], manifest.name, 'map an array at', label)
};

export default {
    mapItem,
    insertItem
};