<template>
  <div class="card list">
    <a
      v-for="link in links"
      :href="link.link"
      :title="link.title"
      class="listItem"
    >
      {{ link.title }}
    </a>
  </div>
</template>

<script>
import { LocalStorageConnector } from '../libs/localStorage';
const LOCAL_STORAGE_KEY = 'raindrop';

const lsData = new LocalStorageConnector(LOCAL_STORAGE_KEY);

export default {
  data() {
    return {
      links: lsData.get([]),
    };
  },
  async mounted() {
    this.links = await fetch(
      'https://long-rose-salmon-sock.cyclic.app/raindrop'
    ).then((r) => r.json());
    lsData.set(this.links);
  },
};
</script>
