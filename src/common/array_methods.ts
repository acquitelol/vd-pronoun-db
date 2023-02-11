/** 
 * Imports 
 * @param manifest: The plugin's manifest
 * @param tryCallback: Function to wrap another function in a try-catch
 */
import { manifest } from '@vendetta/plugin';
import tryCallback from './try_callback';

/** 
 * Inserts an item into a given array
 * @param {any[]} originalArray: The array provided
 * @param {any} insert: The item to insert
 * @param {number} insertIndex: The index to insert the item
 * @param {string?} label?: The label of the place where the item is being inserted. This is optional.
 * @returns {number}
 */
const insertItem = (originalArray: any[], insert: any, insertIndex: number, label?: string): number => {
    return tryCallback(() => {
        /** 
         * Returns early if it cannot find a valid array.
         * @param {any[] || undefined} originalArray: The array of items which is searched through
         */
        if (!originalArray) return undefined
    
        /**
         * Increment the length and index by 1
         */
        originalArray.length++;
        insertIndex++;

        /** 
         * Shift all of the elements forward
         * @uses @param {any[] || undefined} originalArray: The provided array
         * @uses @param {number} insertIndex: The index to insert the item
         */
        for (let i = originalArray.length - 1; i >= insertIndex; i--) {
            originalArray[i] = originalArray[i - 1];
        }

        /**
         * Insert the item into the array at the correct position
         * @uses @param {any} insert: The item to insert into the array
         */
        originalArray[insertIndex - 1] = insert;

        /**
         * Finally, return the new array's length.
         */
        return originalArray.length
    }, [originalArray, insert, insertIndex], manifest.name, "insert an item at", label)
}

/** 
 * Loops through an array, runs a callback for each iteration, and pushes the result of that callback to a new array
 * @param {any[]} array: The starting array
 * @param {any} callback: The function to run
 * @param {string} label: Optional label to descibe what the function is doing
 * @returns {<array>}
 */
const mapItem = <T>(array: T[], callback: any, label?: string): any[] => {
    return tryCallback(() => {
        /** 
         * Start off with an empty array.
         * @param {any[]} newArray: The array to start with.
         */
        let newArray = []

        /** 
         * Loop through the array and run the callback at each iteration, then push the return value to the new array
         * @param {number} i: The iteration
         * @param {any[]} array: The array provided
         * @param {any} callback: The function to run
         * 
         * @uses @func insertItem: Insert an item into an array reference with the index provided
         */
        for(let i = 0; i < array.length; i++) {
            insertItem(newArray, callback(array[i], i, array), newArray.length)
        }

        /** 
         * Finally, return the array
         * @param newArray
         */
        return newArray
    }, [array, callback], manifest.name, 'map an array at', label)
};

export default {
    mapItem,
    insertItem
};