<script>
    import { getContext } from "svelte";

    export let selectable
    export let selected = false
    export let open = false
    export let href = false
    export let onClick
    export let title
    export let icon 
    export let size
    export let key = ""
    export let parentKey = null

    const selectedItems = getContext("selectedItems")

    function handleClick (event) {
      if ($$slots.default)
        open = !open
      else {
        selected = selectable ? !selected : false; 
        notifyParent(selected)
      }

      if (onClick) {  
        onClick({ nodeType:nodeType, nodeKey:key, nodeValue: title, selectedItems: $selectedItems});
      }
    }

    function notifyParent ( selected ) {
      if (selected) {
        $selectedItems = [...$selectedItems, { nodeKey: key, nodeValue: title, parentKey: parentKey }]
      } else {
        selectedItems.update(state => {
          const indx = state.findIndex(v => v.nodeKey === key && v.parentKey === parentKey);
          state.splice(indx, indx >= 0 ? 1 : 0);
          return state;
        });
      }
    }

    let iconSize = "ri-sm"
    $: nodeType = parentKey ? "Item" : "Node"

  </script>
  
  <!-- svelte-ignore a11y-click-events-have-key-events -->

  <li  
    class:is-selected={selected}
    class:is-open={open}
    class="spectrum-TreeView-item"
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span on:click={handleClick}  class="spectrum-TreeView-itemLink" {href}> 

      {#if $$slots.default}
        <svg
          class="spectrum-Icon spectrum-UIIcon-ChevronRight100 spectrum-TreeView-itemIndicator"
          focusable="false"
          aria-hidden="true"
        >
          <use xlink:href="#spectrum-css-icon-Chevron100" />
        </svg>
      {/if}
      
      <span class="spectrum-TreeView-itemLabel">       
        {#if icon}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
          <i class="{icon} {iconSize}" />
        {/if} 
       {title} 
      </span>
    </span>

    {#if $$slots.default}
      <ul class="spectrum-TreeView spectrum-TreeView--size{size}">
        <slot />
      </ul>
    {/if}

  </li>

  <style>
    i {
      margin-right: 0.25rem;
    }
    .spectrum-TreeView-itemLabel {
      display: flex;
      align-items: center;
    }
  </style>