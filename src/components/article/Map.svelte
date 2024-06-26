<script>
  import * as d3 from 'd3';
  import rawWorldMap from "$data/world-geojson2.json";
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import viewport from "$stores/viewport.js";

  export let data;

  let nodes = [];
  let pathGenerator;
  let projection;

  const colorMapping = {
        Advocate: "#4FB477",
        Neutral: "#D69C2B",
        Oppose: "#A34131"
    };

  $: positionColor = (position) => colorMapping[position] || "#000000";


  const worldMap = {
    ...rawWorldMap,
    features: rawWorldMap.features.filter(feature => feature.properties.NAME !== "Antarctica")
  };

  onMount(() => {
    projection = d3.geoEqualEarth()
      .fitSize([($viewport.width - 10), $viewport.height], worldMap);

    pathGenerator = d3.geoPath().projection(projection);

    const simulation = d3.forceSimulation(data)
      .force('x', d3.forceX(d => {
        const countryCoordinates = {};
        worldMap.features.forEach(feature => {
          if (feature.properties.LABEL_X && feature.properties.LABEL_Y) {
            const [x, y] = projection([feature.properties.LABEL_X, feature.properties.LABEL_Y]);
            countryCoordinates[feature.properties.NAME] = [x, y];
          }
        });
        const coordinates = countryCoordinates[d.country];
        return coordinates ? coordinates[0] : 0;
      }).strength(0.5))
      .force('y', d3.forceY(d => {
        const countryCoordinates = {};
        worldMap.features.forEach(feature => {
          if (feature.properties.LABEL_X && feature.properties.LABEL_Y) {
            const [x, y] = projection([feature.properties.LABEL_X, feature.properties.LABEL_Y]);
            countryCoordinates[feature.properties.NAME] = [x, y];
          }
        });
        const coordinates = countryCoordinates[d.country];
        return coordinates ? coordinates[1] : 0;
      }).strength(0.5))
      .force('collide', d3.forceCollide(6))
      .on('tick', () => {
        nodes = simulation.nodes();
      });
  })
</script>

<div class="map-container" style="width: {$viewport.width}; height: {$viewport.height}px;">
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <svg 
    width={$viewport.width}
    height={$viewport.height}
  >
    <g>
      {#if pathGenerator}
        <path class="earth" d={pathGenerator({ type: 'Sphere' })} />
        {#each worldMap.features as feature}
          <path class="country" d={pathGenerator(feature)}>
          </path>
        {/each}
        {#each nodes as node, index}
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <circle
            class="node"
            r="5"
            cx={node.x}
            cy={node.y}
            fill={positionColor(node.position)}
            opacity=1
            in:fade={{ delay: index * 10 }}
          />
        {/each}
      {/if}
    </g>
  </svg>
</div>

<style>
  .map-container {
    background-color: #1A2E3C;
  }
  .earth {
    fill: #1A2E3C;
  }
  .country {
    stroke: #1A2127;
    fill: white;
    stroke-width: 0px;
    fill-opacity: .2;
    pointer-events: none;
  }
  circle {
    transition: stroke 300ms ease, opacity 300ms ease, cx 100ms ease, cy 100ms ease;
    pointer-events: none;
  }
</style>
