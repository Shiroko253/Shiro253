/**
 * ShirokoHub - 主要 JavaScript 檔案
 * 負責處理時間顯示、側邊欄切換和其他互動功能
 */

// 時間相關功能
const TimeModule = {
    /**
     * 更新當前時間顯示
     */
    updateTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        
        const timeElement = document.getElementById('current-time');
        if (timeElement) {
            timeElement.textContent = `${hours}:${minutes}:${seconds}`;
        }
    },

    /**
     * 初始化時間顯示
     */
    init() {
        // 立即更新一次時間
        this.updateTime();
        // 每秒更新一次
        setInterval(() => this.updateTime(), 1000);
    }
};

// 側邊欄相關功能
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
            // 移動設備:顯示/隱藏側邊欄
            this.sidebar.classList.toggle('expanded');
            this.overlay.classList.toggle('active');
        } else {
            // 桌面設備:收合/展開側邊欄
            this.sidebar.classList.toggle('expanded');
        }

        // 保存狀態到 localStorage
        localStorage.setItem('sidebarExpanded', this.isExpanded);
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
     * 添加工具提示
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
            // 桌面模式:移除移動端的 active 類
            this.overlay.classList.remove('active');
        } else {
            // 移動模式:關閉側邊欄
            if (!this.sidebar.classList.contains('expanded')) {
                this.sidebar.classList.remove('expanded');
            }
        }
    },

    /**
     * 恢復保存的側邊欄狀態
     */
    restoreState() {
        const savedState = localStorage.getItem('sidebarExpanded');
        if (savedState === 'true' && window.innerWidth > 768) {
            this.sidebar.classList.add('expanded');
            this.isExpanded = true;
        }
    },

    /**
     * 初始化側邊欄功能
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

        // 恢復保存的狀態
        this.restoreState();

        // 切換按鈕點擊事件
        this.toggleButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleSidebar();
        });

        // 遮罩層點擊事件 (移動設備關閉側邊欄)
        this.overlay.addEventListener('click', () => {
            this.closeSidebar();
        });

        // 導航連結點擊時關閉側邊欄 (移動設備)
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

        console.log('側邊欄功能已初始化 ✨');
    }
};

// 導航相關功能
const NavigationModule = {
    /**
     * 設置當前活動頁面
     */
    setActivePage() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-links a');
        
        navLinks.forEach(link => {
            const linkPath = new URL(link.href).pathname;
            if (linkPath === currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    },

    /**
     * 初始化導航功能
     */
    init() {
        this.setActivePage();
    }
};

// 動畫相關功能
const AnimationModule = {
    /**
     * 為卡片添加進入動畫
     */
    animateCards() {
        const cards = document.querySelectorAll('.content-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        entry.target.style.transition = 'all 0.6s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                    
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

        console.log('工具提示已初始化 ✨');
    }
};

// 工具函數
const Utils = {
    /**
     * 平滑滾動到頂部
     */
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    },

    /**
     * 檢測設備類型
     */
    isMobile() {
        return window.innerWidth <= 768;
    },

    /**
     * 防抖函數
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// 主初始化函數
function init() {
    // 等待 DOM 完全載入
    document.addEventListener('DOMContentLoaded', () => {
        // 初始化各個模組
        TimeModule.init();
        SidebarModule.init();
        NavigationModule.init();
        AnimationModule.init();
        TooltipModule.init();

        console.log('ShirokoHub 已完全初始化 🚀');
    });
}

// 執行初始化
init();

// 導出模組供其他腳本使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TimeModule,
        SidebarModule,
        NavigationModule,
        AnimationModule,
        TooltipModule,
        Utils
    };
}
