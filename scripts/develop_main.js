/**
 * develop_main.js - 開發進度頁面的 JavaScript
 * 負責處理時間顯示、側邊欄切換、進度條動畫和工具提示
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
        localStorage.setItem('developSidebarExpanded', this.isExpanded);
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
        const savedState = localStorage.getItem('developSidebarExpanded');
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

// 進度條動畫模組
const ProgressModule = {
    progressFill: null,
    progressValue: null,

    /**
     * 動畫更新進度值
     */
    animateProgress(targetProgress) {
        let currentProgress = 0;
        const duration = 2000; // 2秒
        const interval = 20; // 每20ms更新一次
        const steps = duration / interval;
        const increment = targetProgress / steps;

        const timer = setInterval(() => {
            currentProgress += increment;
            if (currentProgress >= targetProgress) {
                currentProgress = targetProgress;
                clearInterval(timer);
            }

            // 更新進度條寬度
            if (this.progressFill) {
                this.progressFill.style.width = `${currentProgress}%`;
            }

            // 更新進度數值
            if (this.progressValue) {
                this.progressValue.textContent = `${Math.round(currentProgress)}%`;
            }
        }, interval);
    },

    /**
     * 初始化進度條
     */
    init() {
        this.progressFill = document.getElementById('progressFill');
        this.progressValue = document.getElementById('progressValue');

        if (!this.progressFill || !this.progressValue) {
            console.warn('進度條元素未找到');
            return;
        }

        // 獲取目標進度
        const targetProgress = parseInt(this.progressFill.dataset.progress) || 100;

        // 延遲啟動動畫以產生更好的視覺效果
        setTimeout(() => {
            this.animateProgress(targetProgress);
        }, 500);

        console.log('進度條已初始化');
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

        // 防止超出視窗邊界
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

        // 為用戶圖標添加工具提示
        const userIcon = document.getElementById('userIcon');
        this.addTooltip(userIcon, '這就是我 一個開發者的一個網頁');

        // 為側邊欄標題添加工具提示
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
        const cards = document.querySelectorAll('.content-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(30px)';
                    
                    // 為每個卡片添加延遲，創建交錯效果
                    setTimeout(() => {
                        entry.target.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 150);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        cards.forEach(card => observer.observe(card));
    },

    /**
     * 為更新列表添加動畫
     */
    animateUpdateList() {
        const listItems = document.querySelectorAll('.update-list li');
        
        listItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.4s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 800 + (index * 100));
        });
    },

    /**
     * 為時間軸添加動畫
     */
    animateTimeline() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateX(-20px)';
                    
                    setTimeout(() => {
                        entry.target.style.transition = 'all 0.5s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0)';
                    }, index * 200);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });

        timelineItems.forEach(item => observer.observe(item));
    },

    /**
     * 初始化動畫
     */
    init() {
        this.animateCards();
        this.animateUpdateList();
        this.animateTimeline();
        console.log('動畫已初始化');
    }
};

// 平滑滾動模組
const SmoothScrollModule = {
    /**
     * 初始化平滑滾動
     */
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        console.log('平滑滾動已初始化');
    }
};

// 頁面載入完成後初始化所有模組
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 開始初始化開發進度頁面...');
    
    // 初始化各個模組
    TimeModule.init();
    SidebarModule.init();
    ProgressModule.init();
    TooltipModule.init();
    AnimationModule.init();
    SmoothScrollModule.init();
    
    // 頁面淡入效果
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    console.log('✨ 開發進度頁面已完全初始化');
});
