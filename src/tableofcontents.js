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
            toggleButton: { enabled: false, id: '' }
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

    initialize() {
        if (!this.contentArea || !this.toc) {
            console.error("Initialization failed: contentArea or TOC container not found.");
            return;
        }

        const headings = this.contentArea.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const tocList = document.createElement('ul');
        let itemCount = 0;

        headings.forEach(h => {
            itemCount++;
            const tagName = h.tagName.toLowerCase();
            const idList = this.headingIds[tagName];
            const count = this.counters[tagName];

            if (idList && idList.length >= count) {
                h.id = idList[count - 1];
            } else {
                h.id = `header${this.idCount}`;
            }

            this.counters[tagName]++;
            this.idCount++;

            const tocItem = document.createElement('li');
            tocItem.classList.add(this.options.classes[tagName] || `toc-${tagName}`);
            if (itemCount > this.options.maxItems) {
                tocItem.classList.add('hidden');
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
                const hiddenItems = tocList.querySelectorAll('.hidden');
                hiddenItems.forEach(item => item.classList.remove('hidden'));
                showAllButton.style.display = 'none';
            });
        }

        this.toc.appendChild(tocList);

        const toggleButton = this.options.toggleButton.enabled ? document.getElementById(this.options.toggleButton.id) : null;
        if (toggleButton) {
            toggleButton.addEventListener('click', () => {
                this.toc.classList.toggle('active');
                const isActive = this.toc.classList.contains('active');
                if (showAllButton) {
                    showAllButton.style.display = isActive && itemCount > this.options.maxItems ? 'block' : 'none';
                }
                if (!isActive) {
                    const hiddenItems = tocList.querySelectorAll('li');
                    hiddenItems.forEach((item, index) => {
                        if (index >= this.options.maxItems) {
                            item.classList.add('hidden');
                        }
                    });
                }
            });
        }

        this.toc.classList.add('active');
        if (showAllButton) {
            showAllButton.style.display = itemCount > this.options.maxItems ? 'block' : 'none';
        }
    }
}

// グローバル関数として提供
window.Toc = Toc;