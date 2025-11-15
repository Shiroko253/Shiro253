/**
 * projects_main.js - 我的作品頁面的 JavaScript
 * 負責處理時間顯示、側邊欄切換和工具提示
 */

// 時間更新模組
const TimeModule = {
    /**
     * 更新時間顯示
     */
    updateTime() {
        const timeElement = document.getElementById('current-time');
        if (!timeElement) return;

        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        timeElement.textContent = `${hours}:${minutes}:${seconds}`;
    },

    /**
     * 初始化時間模組
     */
    init() {
        // 立即更新一次
        this.updateTime();
        // 每秒更新
        setInterval(() => this.updateTime(), 1000);
    }
};

// 側邊欄切換模組
const SidebarModule = {
    sidebar: null,
    toggleButton: null,
    overlay: null,
    isExpanded: false,

    /**
     * 切換側邊欄狀態
     */
    toggleSidebar() {
        this.isExpanded = !this.isExpanded;
        
        if (window.innerWidth <= 768) {
            // 移動設備
            this.sidebar.classList.toggle('expanded');
            this.overlay.classList.toggle('active');
        } else {
            // 桌面設備
            this.sidebar.classList.toggle('expanded');
        }

        // 保存狀態
        localStorage.setItem('projectsSidebarExpanded', this.isExpanded);
    },

    /**
     * 關閉側邊欄 (移動設備)
     */
    closeSidebar() {
        if (window.innerWidth <= 768) {
            this.sidebar.classList.remove('expanded');
            this.overlay.classList.remove('active');
            this.isExpanded = false;
        }
    },

    /**
     * 添加工具提示屬性
     */
    addTooltips() {
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            const text = link.querySelector('.nav-text');
            if (text) {
                link.setAttribute('data-tooltip', text.textContent);
            }
        });
    },

    /**
     * 處理窗口大小改變
     */
    handleResize() {
        if (window.innerWidth > 768) {
            this.overlay.classList.remove('active');
        } else {
            if (!this.sidebar.classList.contains('expanded')) {
                this.sidebar.classList.remove('expanded');
            }
        }
    },

    /**
     * 恢復保存的狀態
     */
    restoreState() {
        const savedState = localStorage.getItem('projectsSidebarExpanded');
        if (savedState === 'true' && window.innerWidth > 768) {
            this.sidebar.classList.add('expanded');
            this.isExpanded = true;
        }
    },

    /**
     * 初始化側邊欄
     */
    init() {
        this.sidebar = document.getElementById('sidebar');
        this.toggleButton = document.getElementById('toggleButton');
        this.overlay = document.getElementById('sidebarOverlay');

        if (!this.sidebar || !this.toggleButton || !this.overlay) {
            console.error('側邊欄元素未找到');
            return;
        }

        // 添加工具提示
        this.addTooltips();

        // 恢復狀態
        this.restoreState();

        // 切換按鈕事件
        this.toggleButton.addEventListener('click', () => {
            this.toggleSidebar();
        });

        // 遮罩層事件
        this.overlay.addEventListener('click', () => {
            this.closeSidebar();
        });

        // 導航連結事件
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    this.closeSidebar();
                }
            });
        });

        // 窗口大小改變事件
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.handleResize();
            }, 250);
        });

        console.log('側邊欄已初始化');
    }
};

// 工具提示模組
const TooltipModule = {
    tooltip: null,

    /**
     * 創建工具提示元素
     */
    createTooltip() {
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'custom-tooltip';
        document.body.appendChild(this.tooltip);
    },

    /**
     * 顯示工具提示
     */
    showTooltip(element, text) {
        if (!this.tooltip) return;

        this.tooltip.textContent = text;
        this.tooltip.classList.add('show');

        const rect = element.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();
        
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.bottom + 10;

        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }

        this.tooltip.style.left = `${left}px`;
        this.tooltip.style.top = `${top}px`;
    },

    /**
     * 隱藏工具提示
     */
    hideTooltip() {
        if (this.tooltip) {
            this.tooltip.classList.remove('show');
        }
    },

    /**
     * 為元素添加工具提示
     */
    addTooltip(element, text) {
        if (!element) return;

        element.addEventListener('mouseenter', () => {
            this.showTooltip(element, text);
        });

        element.addEventListener('mouseleave', () => {
            this.hideTooltip();
        });
    },

    /**
     * 初始化工具提示
     */
    init() {
        this.createTooltip();

        const userIcon = document.getElementById('userIcon');
        this.addTooltip(userIcon, '這就是我 一個開發者的一個網頁');

        const sidebarTitle = document.getElementById('sidebarTitle');
        this.addTooltip(sidebarTitle, 'Shiroko253');

        console.log('工具提示已初始化');
    }
};

// 動畫模組
const AnimationModule = {
    /**
     * 為卡片添加進入動畫
     */
    animateCards() {
        const cards = document.querySelectorAll('.content-card, .project-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '0';
                        entry.target.style.transform = 'translateY(30px)';
                        
                        setTimeout(() => {
                            entry.target.style.transition = 'all 0.6s ease';
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, 100);
                    }, index * 100);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        cards.forEach(card => observer.observe(card));
    },

    /**
     * 初始化動畫
     */
    init() {
        this.animateCards();
        console.log('動畫已初始化');
    }
};

// 專案卡片互動模組
const ProjectCardsModule = {
    /**
     * 添加卡片懸停效果
     */
    addHoverEffects() {
        const projectCards = document.querySelectorAll('.project-card:not(.placeholder)');
        
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    },

    /**
     * 初始化專案卡片互動
     */
    init() {
        this.addHoverEffects();
        console.log('專案卡片互動已初始化');
    }
};

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', () => {
    TimeModule.init();
    SidebarModule.init();
    TooltipModule.init();
    AnimationModule.init();
    ProjectCardsModule.init();
    
    console.log('我的作品頁面已完全初始化 ✨');
});
