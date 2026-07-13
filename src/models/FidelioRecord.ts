import {FidelioRequest} from "../requests/FidelioRequest";
import {INote} from "../interfaces/types";

/**
 * Shared ActiveRecord-style base for Fidelio entities: keeps the working
 * copy (_attributes) and the server snapshot (_original), and computes the
 * changed-field payload that save() sends.
 */
export abstract class FidelioRecord<T extends {Notes?: any[]}> extends FidelioRequest {

    protected _attributes: T = {} as T; // Data Fidelio
    protected _original: T | null = null; // Data Fidelio

    constructor(record: T | null = null) {
        super();
        if (record) {
            const str = JSON.stringify(record);
            this._original = JSON.parse(str);
            this._attributes = JSON.parse(str);
        }
    }

    /**
     * JSON.stringify serializes the working attributes by default
     */

    toJSON() {
        return this._attributes
    }

    /**
     * Getter
     */

    get data(): T {
        return this._attributes
    }

    /**
     * Setter
     * @param attributes
     */

    set attributes(attributes: T) {
        this._attributes = Object.assign({}, attributes);
    }

    set(attributes: Partial<T>) {
        this._attributes = Object.assign(this._attributes, attributes);
        return this;
    }

    /**
     * Fields that differ from the server snapshot, restricted to the
     * entity's updatable-field whitelist.
     */

    protected changedFields<TUpdate>(whitelist: readonly string[]): TUpdate {
        const changed = {} as TUpdate;
        for (const key of Object.keys(this._attributes) as (keyof T)[]) {
            if (whitelist.includes(key as string)
                && (!this._original || JSON.stringify(this._attributes[key]) !== JSON.stringify(this._original[key]))) {
                (changed as any)[key] = this._attributes[key]
            }
        }
        return changed
    }

    /**
     * Mark the current working copy as the server snapshot, so the next
     * save() diffs against it (used after a write without refetch).
     */

    protected syncOriginal() {
        this._original = JSON.parse(JSON.stringify(this._attributes));
    }

    /**
     * Add note
     * @param note
     */

    addNote(note: INote) {
        if (!this._attributes.Notes) {
            this._attributes.Notes = [];
        }
        this._attributes.Notes.push(note)
        return this;
    }

    /**
     * Mark notes as deleted by id, list of ids, or 'ALL'
     * @param noteID
     */

    deleteNote(noteID: number | number[] | 'ALL'): this {
        const notes = this._attributes.Notes;
        if (!notes) return this;

        const markDeleted = (note: any) => {
            note.Delete = 1
            note.value = JSON.stringify(note.value)
        }

        if (typeof noteID === 'number') {
            notes.filter(note => Number(note.noteID) === noteID).forEach(markDeleted)
        } else if (Array.isArray(noteID)) {
            notes.filter(note => noteID.includes(Number(note.noteID))).forEach(markDeleted)
        } else if (noteID === 'ALL') {
            notes.forEach(markDeleted)
        }

        return this
    }
}
