/**
 * @param PronounManager: The main object to handle the discord ids-pronouns map aswell as the queue and reference map of pronouns
 * Thank you to Pylix (492949202121261067 / pylixフユ#8636) for their @arg { Aliucord } PronounDB plugin.
 * Without it, it would've been significantly harder to figure out how to do this.
 */
export default {
    /**
     * @param { [key: string]: string } map: The object containing @var { Discord } IDs as the key and @var { Shorthand } pronoun as the value
     */
    map: {} as { [key: string]: string },

    /**
     * @param {any[]} queue: A queue of @var { Discord } IDs which still need fetching and storing.
     */
    queue: [] as any[],

    /**
     * @param {boolean} fetching: Whether the main @func updateQueuedPronouns handler is currently fetching pronouns.
     */
    fetching: false as boolean,

    /**
     * @param {Record<string, string>} referenceMap: The map from @var {shorthand} pronouns to @var {full} pronouns
     */
    referenceMap: {
        hh: "he/him",
        hi: "he/it",
        hs: "he/she",
        ht: "he/they",
        ih: "it/him",
        ii: "it/its",
        is: "it/she",
        it: "it/they",
        shh: "she/he",
        sh: "she/her",
        si: "she/it",
        st: "she/they",
        th: "they/he",
        ti: "they/it",
        ts: "they/she",
        tt: "they/them",
        any: "any",
        other: "other",
        ask: "ask",
        avoid: "avoid, use name",
        unspecified: "unspecified"
    } as Record<string, string>,

    /**
     * Fetches 15 unique @var { Discord } IDs' Pronouns from the PronounDB database at a time and set them to the map.
     * @returns {Promise<void>}
     */
    async updateQueuedPronouns(): Promise<void> {
        // return early if the queue is empty or if current fetching (function will be recalled recusively at the end to clean up anyway)
        if (this.queue.length <= 0 || this.fetching) return;

        // fetch and remove the first 15 ids
        const ids = this.queue.splice(0, 15);

        // get a new id from the top of the queue stack until you get one which is not in the map already (so unique and needs to be fetched)
        const greedilyGetNewID = (id: string) => {
            if (this.queue.length <= 0) return id;
            if (this.map[id]) return greedilyGetNewID(this.queue.shift())
            return id;
        }

        // for each id, greedily get a new unique id
        for (const id of ids) {
            if (this.map[id]) ids[id] = greedilyGetNewID(id)
        }

        // set fetching to true. any new instances of this function called will return early.
        this.fetching = true;

        // fetch the unfiltered list of pronouns with the ids as the search param
        const unfilteredPronounRes = await(
            await fetch(`https://pronoundb.org/api/v1/lookup-bulk?platform=discord&ids=${ids.join(",")}`, {
                method: "GET",
                headers: { "Accept": "application/json", "X-PronounDB-Source": "Enmity" }
            })
        ).json()

        // filter each pronoun to be formattable as a number
        const filteredPronounRes = Object.fromEntries(
            Object
                .entries(unfilteredPronounRes)
                .filter(([key, _]) => !isNaN(+key)));
        Object.assign(this.map, filteredPronounRes)

        // set fetching back to false, so any new instances will be able to continue past the first if check.
        this.fetching = false;
        
        // recall the function recursively if any items are still in the queue
        if (this.queue.length > 0) this.updateQueuedPronouns();
    }
}