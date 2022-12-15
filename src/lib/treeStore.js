import { writable } from "svelte/store";

const createTreeStore = () => {
    const { set, update, subscribe } = writable({
      _parentID: undefined,
      items: [],
      schema: {},
      direction: "horizontal",
      changed: false,
      centered: false
    });
  
    // if you don't want to allow to modify the store with `$tableStore.direction = 'xyz'`, don't return the `set` and `update` functions
    return {
      set, // <--
      update, // <--
      subscribe,
      setSchema(dpschema) {
        update(state => (
          { ...state, schema: dpschema }
          ));
      },
      
      registerColumn(column) {
        update(state => ({ ...state, items: [...state.items, column] }));
      },
      unregisterColumn(column) { 
        update(state => {
          const indx = state.items.findIndex(v => v.id === column.id);
          state.items.splice(indx, indx >= 0 ? 1 : 0);
          // state.items.sort ( ((a,b) => a.order - b.order) )
          return state;
        });
      },
      updateColumn(column) { 
        update(state => {
          const indx = state.items.findIndex(v => v.id === column.id);
          if (indx > -1) { 
            state.items[indx] = column 
          }
          state.items.sort ( ((a,b) => a.order - b.order) )
          return state;
        });
      }
    };
  };
  
  export const treeStore = createTreeStore();