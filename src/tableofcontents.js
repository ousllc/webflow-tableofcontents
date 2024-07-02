class Toc {
    constructor(contentSelector, tocSelector, headingIds, options = {}) {
        this.contentArea = document.querySelector(contentSelector);
        this.toc = document.querySelector(tocSelector);
        if (!this.contentArea || !this.toc) {
            console.error("Content area or TOC container not found.");
            return;
        }
        this.headingIds = headingIds;
        this.options = Object.assign({
            offsetTop: 120,
            duration: 500,
            maxItems: 10,
            classes: {
                h1: 'toc-h1',
                h2: 'toc-h2',
                h3: 'toc-h3',
                h4: 'toc-h4',
                h5: 'toc-h5',
                h6: 'toc-h6'
            },
            showAll: { enabled: false, id: '' },
            toggleButton: { enabled: false, id: '' },
            includeHeadings: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] // 追加: 目次に含める見出しレベル
        }, options);
        this.counters = {
            h1: 1,
            h2: 1,
            h3: 1,
            h4: 1,
            h5: 1,
            h6: 1
        };
        this.idCount = 1;
    }

    sanitizeId(id) {
        return id.replace(/[^a-zA-Z0-9-_]/g, '');
    }

    initialize() {
        if (!this.contentArea || !this.toc) {
            console.error("Initialization failed: contentArea or TOC container not found.");
            return;
        }

        // オプションで指定された見出しレベルを使用してセレクタを作成
        const selector = this.options.includeHeadings.join(', ');
        const headings = this.contentArea.querySelectorAll(selector);
        const tocList = document.createElement('ul');
        let itemCount = 0;

        headings.forEach(h => {
            const tagName = h.tagName.toLowerCase();
            itemCount++;

            const idList = this.headingIds[tagName];
            const count = this.counters[tagName];

            if (idList && idList.length >= count) {
                h.id = this.sanitizeId(idList[count - 1]);
            } else {
                h.id = `header${this.idCount}`;
            }

            this.counters[tagName]++;
            this.idCount++;

            const tocItem = document.createElement('li');
            tocItem.classList.add(this.options.classes[tagName] || `toc-${tagName}`);
            if (itemCount > this.options.maxItems && this.options.includeHeadings.includes(tagName)) {
                tocItem.style.display = 'none';
            }
            const tocLink = document.createElement('a');
            tocLink.href = `#${h.id}`;
            tocLink.textContent = h.textContent;
            tocLink.addEventListener('click', (e) => {
                e.preventDefault();
                const header = document.querySelector(`#${h.id}`);
                const headerTop = header.getBoundingClientRect().top + window.pageYOffset;
                const offsetTop = headerTop - this.options.offsetTop;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            });
            tocItem.appendChild(tocLink);

            let currentList = tocList;
            if (tagName !== 'h1') {
                const parentTag = `h${parseInt(tagName[1]) - 1}`;
                const parentItems = tocList.querySelectorAll(`.${this.options.classes[parentTag] || `toc-${parentTag}`}`);
                if (parentItems.length > 0) {
                    const lastParentItem = parentItems[parentItems.length - 1];
                    let subList = lastParentItem.querySelector('ul');
                    if (!subList) {
                        subList = document.createElement('ul');
                        lastParentItem.appendChild(subList);
                    }
                    currentList = subList;
                }
            }
            currentList.appendChild(tocItem);
        });

        const showAllButton = this.options.showAll.enabled ? document.getElementById(this.options.showAll.id) : null;
        if (showAllButton && itemCount > this.options.maxItems) {
            showAllButton.addEventListener('click', () => {
                const hiddenItems = tocList.querySelectorAll('li[style="display: none;"]');
                hiddenItems.forEach(item => item.style.display = 'list-item');
                showAllButton.style.display = 'none';
            });
        }

        this.toc.appendChild(tocList);

        const toggleButton = this.options.toggleButton.enabled ? document.getElementById(this.options.toggleButton.id) : null;
        if (toggleButton) {
            toggleButton.addEventListener('click', () => {
                const isActive = this.toc.style.display !== 'none';
                if (isActive) {
                    this.toc.style.display = 'none';
                    if (showAllButton) {
                        showAllButton.style.display = 'none';
                    }
                    // Reset hidden items
                    const hiddenItems = tocList.querySelectorAll('li');
                    hiddenItems.forEach((item, index) => {
                        const tagName = item.querySelector('a').hash.substring(1).match(/^header\d+$/) ? 'h2' : 'h1';
                        if (index >= this.options.maxItems && this.options.includeHeadings.includes(tagName)) {
                            item.style.display = 'none';
                        }
                    });
                } else {
                    this.toc.style.display = 'block';
                    if (showAllButton) {
                        showAllButton.style.display = itemCount > this.options.maxItems ? 'block' : 'none';
                    }
                }
            });
        }

        this.toc.style.display = 'block';
        if (showAllButton) {
            showAllButton.style.display = itemCount > this.options.maxItems ? 'block' : 'none';
        }
    }
}

// グローバル関数として提供
window.Toc = Toc;
