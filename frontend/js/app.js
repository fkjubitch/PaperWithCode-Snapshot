const {createApp, ref} = Vue;
const app = createApp({
    methods: {
        toggleAdvanced() {
            this.showAdvanced = !this.showAdvanced;
        },
        search() {
            this.response = [];
            
            if(this.query === "" || this.query === null) {
                console.error('Invalid input: Empty');
                this.response = [{ error: "Invalid input: Empty" }];
                return;
            }

            this.isLoading = true;  // 开始加载
            
            const params = {
                query: this.query,
                type: this.searchType,
                regex: this.useRegex,
                caseSensitive: this.caseSensitive
            };

            axios
                .get('http://127.0.0.1:5000/search', { params })
                .then(response => {
                    this.response = Array.isArray(response.data) ? response.data : [response.data];
                })
                .catch(error => {
                    console.error('Request error:', error);
                    this.response = [{ error: `Request error: ${error}` }];
                })
                .finally(() => {
                    this.isLoading = false;  // 结束加载
                });
        },
        // Get Repository Owner (Deprecated)
        // getRepoOwner(repoUrl) {
        //     if (!repoUrl) return '';
        //     const match = repoUrl.match(/github\.com\/([^/]+)/);
        //     return match ? match[1] : '';
        // },
        highlightText(text, detail, text_type) {
            // 如果detail为空/detail不是数组/detail长度为0/当前搜索的文本类型不与输入的相同，则不进行高亮处理
            if (!detail || !Array.isArray(detail) || detail.length === 0 || text_type !== this.searchType) {
                return text;
            }
            
            // 按位置排序，从后往前处理，避免位置偏移
            const positions = [...detail].sort((a, b) => b[0] - a[0]);
            let result = text;
            
            for (const [start, end] of positions) {
                const before = result.slice(0, start);
                const highlight = result.slice(start, end);
                const after = result.slice(end);
                result = `${before}<span class="highlight">${highlight}</span>${after}`;
            }
            
            return result;
        },
        handlePageJump() {
            const page = parseInt(this.jumpToPage);
            if (isNaN(page) || page < 1 || page > this.totalPages) {
                this.jumpToPage = this.currentPage;
                return;
            }
            this.currentPage = page;
            this.jumpToPage = page;
        }
    },
    data(){
        return {
            query: "",
            searchType: "paper_title",
            searchOptions: [
                { value: "paper_title", label: "Title" },
                { value: "paper_arxiv_id", label: "arXiv ID" },
                { value: "repo_url", label: "Repository URL" }
            ],
            response: [],
            currentPage: 1,
            pageSize: 10,
            jumpToPage: 1,
            isLoading: false,
            showAdvanced: false,
            useRegex: false,
            caseSensitive: false
        }
    },
    computed: {
        totalPages() {
            return Math.ceil(this.response.length / this.pageSize);
        },
        paginatedResults() {
            const start = (this.currentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.response.slice(start, end);
        }
    }
});

app.mount('#app');