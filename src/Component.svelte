<script>
  import "../node_modules/@spectrum-css/treeview/dist/index-vars.css"
  
  import Welcome from "./Welcome.svelte";
  import TreeItem from "./TreeItem.svelte";
  import { getContext } from "svelte"

  const { styleable } = getContext("sdk")
  const component = getContext("component")
  const loading = getContext("loading")

  export let quiet = false
  export let standalone = true
  export let selectable = false
  export let title = ""
  export let size
  export let width = "250px"

  export let dataProvider 
  export let nodeIDColumn
  export let nodeValueColumn
  export let nodeIcon

  export let itemSource // Can be "schema" / "provider" / "custom"
  export let itemRelColumn
  export let itemDataProvider 
  export let itemIDColumn
  export let itemValueColumn
  export let customItems
  export let itemIcon

  export let onNodeClick

  function populateItems( nodeIndex ) {
    let _items = []

    if (itemSource === "schema" && _isColumnEnumerable) 
    {
      if (dataProvider?.schema[itemRelColumn]?.type === "link")
      {
        _items = rows[nodeIndex][itemRelColumn]
      } else {
        _items = rows[nodeIndex][itemRelColumn].map( (v, index) => { return { id: index, primaryDisplay: v} })  
      }
    } 
    else if (itemSource === "provider")
    {
      var _rows = itemDataProvider?.rows;
      if (_rows.length > 0)
      {
        _rows.forEach(row => {
          _items.push( {id : row[itemIDColumn], primaryDisplay : row[itemValueColumn]})
        });
      }
    } 
    else if (itemSource === "custom" && customItems.length > 0)
    {
      _items = customItems?.map( v => { return {id: v.key, primaryDisplay: v.label} })  
    }  

    return _items;     
  }


  // If the parent DataProvider is loading, fill the rows array with a number of empty objects 
  // corresponding to the DataProvider's page size; 
  // this allows skeleton loader components to be rendered further down the tree.
  $: rows = $loading
    ? new Array(dataProvider?.limit > 20 ? 20 : dataProvider?.limit).fill({})
    : dataProvider?.rows

  $: _isColumnEnumerable = ( dataProvider?.schema ) ? ( dataProvider?.schema[itemRelColumn]?.type === "link" || dataProvider?.schema[itemRelColumn]?.type === "array" ) : false
  $: settings = { selectable : selectable, 
                  itemSource : itemSource, 
                  itemRelColumn: itemRelColumn }
</script>

<div use:styleable={$component.styles}>

{#key settings}
    
  {#if rows?.length > 0}
    <ul
    class:spectrum-TreeView--standalone={standalone}
    class:spectrum-TreeView--quiet={quiet}
    class="spectrum-TreeView spectrum-TreeView--size{size}"
    style="width: {width}"
  >

    {#if title !== "" }
      <div class="spectrum-TreeView-heading"><span class="spectrum-TreeView-itemLabel">{title}</span></div>
    {/if}

    {#each rows as node, index}
      <TreeItem 
        id={node[nodeIDColumn]} 
        icon={nodeIcon}
        {selectable}
        title={node[nodeValueColumn] || "Set the Node Key & Label Columns"} 
        {size}
        onClick={onNodeClick}> 
          {#each populateItems(index) as item }
            <TreeItem 
              {selectable} 
              id={item.id} 
              title={item.primaryDisplay} 
              icon={itemIcon}
              onClick={onNodeClick}></TreeItem>
          {/each}      
      </TreeItem>  
    {/each}

  </ul>
  {:else}
    <Welcome />
  {/if}

{/key}

</div>

<style>
  .error {
    position: relative;
    border: 2px dotted red;
    margin: 1rem;
    padding: 0.5rem 1rem;
  }
</style>