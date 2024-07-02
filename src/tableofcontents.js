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
            }
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
        let showAllButton = null;

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

        // Create "Show All" button if item count exceeds maxItems
        if (itemCount > this.options.maxItems) {
            showAllButton = document.createElement('button');
            showAllButton.textContent = '全て表示';
            showAllButton.classList.add('show-all');
            showAllButton.addEventListener('click', () => {
                const hiddenItems = tocList.querySelectorAll('.hidden');
                hiddenItems.forEach(item => item.classList.remove('hidden'));
                showAllButton.style.display = 'none';
            });
            this.toc.appendChild(showAllButton);
        }

        this.toc.appendChild(tocList);

        // Create toggle button
        const toggleButton = document.createElement('button');
        toggleButton.textContent = '目次';
        toggleButton.classList.add('toc-toggle');
        toggleButton.addEventListener('click', () => {
            this.toc.classList.toggle('active');
            if (showAllButton) {
                showAllButton.style.display = this.toc.classList.contains('active') ? 'block' : 'none';
            }
        });
        this.toc.insertBefore(toggleButton, this.toc.firstChild);

        if (showAllButton) {
            showAllButton.style.display = 'none';
        }
    }
}

// グローバル関数として提供
window.Toc = Toc;
