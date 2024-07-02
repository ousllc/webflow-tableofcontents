<script src="https://cdn.jsdelivr.net/gh/ousllc/webflow-tableofcontents@latest/dist/tableofcontents.min.js"></script>

```
const toc = new Toc('.article', '#toc', {
    h1: ["top", "second", "third"],
    h2: ["second"],
    h3: ["third", "third-2"],
    h4: ["h4"],
    h5: [],
    h6: []
}, {
    offsetTop: 100,
    duration: 500,
    maxItems: 2, // 最大表示項目数
    classes: {
        h1: 'custom-toc-h1',
        h2: 'custom-toc-h2',
        h3: 'custom-toc-h3',
        h4: 'custom-toc-h4',
        h5: 'custom-toc-h5',
        h6: 'custom-toc-h6'
    },
    showAll: { enabled: true, id: 'showAllButton' },
    toggleButton: { enabled: true, id: 'toggleButton' }
});

toc.initialize();
```
