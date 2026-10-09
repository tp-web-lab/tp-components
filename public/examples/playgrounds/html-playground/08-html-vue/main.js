import { computed, createApp, ref } from 'vue';

createApp({
  setup() {
    const selected = ref(0);

const items = [
  {
    label: 'HTML',
    text: 'HTML structures the document.',
  },
  {
    label: 'CSS',
    text: 'CSS styles the document.',
  },
  {
    label: 'JavaScript',
    text: 'JavaScript adds behavior.',
  },
  {
    label: 'Vue',
    link: {
      href: 'https://vuejs.org/',
      label: 'Vue',
    },
    text: ' builds reactive interfaces.',
  },
];

    const currentContent = computed(() => {
      const item = items[selected.value];
      return item ? item.content : '';
    });

    return {
      currentContent,
      items,
      selected,
    };
  },
}).mount('#app');