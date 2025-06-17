// 国际化管理器
class I18nManager {
    constructor() {
        this.currentLanguage = 'zh'; // 默认中文
        this.translations = {};
        this.supportedLanguages = {
            'zh': '中文',
            'en': 'English',
            'de': 'Deutsch',
            'es': 'Español',
            'fr': 'Français',
            'jp': '日本語',
            'ru': 'Русский'
        };
        // 添加调试信息
        console.log('I18nManager initialized with default language:', this.currentLanguage);
        this.init();
    }

    async init() {
        // 从localStorage获取保存的语言设置
        const savedLanguage = localStorage.getItem('termsai_language');
        if (savedLanguage && this.supportedLanguages[savedLanguage]) {
            this.currentLanguage = savedLanguage;
        }
        
        // 加载当前语言的翻译文件
        await this.loadTranslations(this.currentLanguage);
        
        // 应用翻译
        this.applyTranslations();
        
        // 创建语言选择器
        this.createLanguageSelector();
    }

    async loadTranslations(language) {
        try {
            const response = await fetch(`/language/${language}/translation.json`);
            if (response.ok) {
                this.translations = await response.json();
            } else {
                console.error(`Failed to load translations for ${language}`);
                // 如果加载失败，尝试加载中文作为后备
                if (language !== 'zh') {
                    const fallbackResponse = await fetch('/language/zh/translation.json');
                    if (fallbackResponse.ok) {
                        this.translations = await fallbackResponse.json();
                    }
                }
            }
        } catch (error) {
            console.error('Error loading translations:', error);
        }
    }

    createLanguageSelector() {
        // 创建语言选择器容器
        const languageSelector = document.createElement('div');
        languageSelector.className = 'language-selector';
        
        // 创建下拉选择框
        const select = document.createElement('select');
        select.id = 'language-select';
        select.className = 'language-select';
        
        // 添加选项
        Object.entries(this.supportedLanguages).forEach(([code, name]) => {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = name;
            option.selected = code === this.currentLanguage;
            select.appendChild(option);
        });
        
        // 添加事件监听器
        select.addEventListener('change', (e) => {
            this.changeLanguage(e.target.value);
        });
        
        languageSelector.appendChild(select);
        
        // 将语言选择器插入到header中，与标题对齐
        const header = document.querySelector('.header');
        const headerContent = header.querySelector('div[style*="display: flex"]');
        if (headerContent) {
            headerContent.appendChild(languageSelector);
        }
    }

    async changeLanguage(language) {
        if (language === this.currentLanguage) return;
        
        this.currentLanguage = language;
        localStorage.setItem('termsai_language', language);
        
        // 加载新语言的翻译
        await this.loadTranslations(language);
        
        // 应用翻译
        this.applyTranslations();
    }

    applyTranslations() {
        // 更新页面标题
        document.title = `${this.translations.title} - 关系图谱生成器`;

        // 更新标题和副标题
        const title = document.querySelector('h1');
        if (title && this.translations.title) {
            title.textContent = this.translations.title;
        }

        const subtitle = document.querySelector('.subtitle');
        if (subtitle && this.translations.subtitle) {
            subtitle.textContent = this.translations.subtitle;
        }

        // 更新按钮文本
        const generateBtn = document.getElementById('generate-btn');
        if (generateBtn && this.translations.generate) {
            generateBtn.textContent = this.translations.generate;
        }

        // 更新带图标的按钮文本
        const buttonTextElements = [
            { selector: '#download-btn .button-text', key: 'saveImage' },
            { selector: '#search-graph-btn .button-text', key: 'searchGraph' },
            { selector: '#add-concept-btn .button-text', key: 'addNode' },
            { selector: '#dislike-btn .button-text', key: 'regenerate' },
            { selector: '#like-btn .button-text', key: 'like' }
        ];

        buttonTextElements.forEach(({ selector, key }) => {
            const element = document.querySelector(selector);
            if (element && this.translations[key]) {
                element.textContent = this.translations[key];
            }
        });

        // 更新输入框占位符
        const topicInput = document.getElementById('topic-input');
        if (topicInput && this.translations.enterTopic) {
            topicInput.placeholder = this.translations.enterTopic;
        }

        // 更新标签文本
        const nodeCountLabel = document.querySelector('.input-group label');
        if (nodeCountLabel && this.translations.nodeCount) {
            nodeCountLabel.textContent = this.translations.nodeCount + '：';
        }

        const rangeHint = document.querySelector('.range-hint');
        if (rangeHint && this.translations.range) {
            rangeHint.textContent = `（${this.translations.range}）`;
        }

        // 特殊处理一些复杂的元素
        this.updateComplexElements();
    }

    updateComplexElements() {
        // 更新AI免责声明
        const disclaimer = document.querySelector('.ai-disclaimer');
        if (disclaimer && this.translations.aiDisclaimer && this.translations.contactAuthor) {
            disclaimer.innerHTML = `${this.translations.aiDisclaimer}<a id="feedback-link" href="#">${this.translations.contactAuthor}</a>。`;
        }

        // 更新模态框标题（根据不同的模态框）
        const addNodeModal = document.querySelector('#modal-overlay .modal-title');
        if (addNodeModal && this.translations.addNewNode) {
            addNodeModal.textContent = this.translations.addNewNode;
        }

        const searchModal = document.querySelector('#modal-overlay-search .modal-title');
        if (searchModal && this.translations.search) {
            searchModal.textContent = this.translations.search;
        }

        // 更新模态框按钮
        const confirmAddBtn = document.getElementById('confirm-add-concept');
        if (confirmAddBtn && this.translations.add) {
            confirmAddBtn.textContent = this.translations.add;
        }

        const cancelAddBtn = document.getElementById('cancel-add-concept');
        if (cancelAddBtn && this.translations.cancel) {
            cancelAddBtn.textContent = this.translations.cancel;
        }

        const confirmSearchBtn = document.getElementById('confirm-search-graph');
        if (confirmSearchBtn && this.translations.search) {
            confirmSearchBtn.textContent = this.translations.search;
        }

        const cancelSearchBtn = document.getElementById('cancel-search-graph');
        if (cancelSearchBtn && this.translations.cancel) {
            cancelSearchBtn.textContent = this.translations.cancel;
        }

        // 更新输入框占位符
        const newConceptInput = document.getElementById('new-concept-input');
        if (newConceptInput && this.translations.enterNewConcept) {
            newConceptInput.placeholder = this.translations.enterNewConcept;
        }

        const searchInput = document.getElementById('search-graph-input');
        if (searchInput && this.translations.graphId) {
            searchInput.placeholder = this.translations.graphId;
        }
    }

    // 获取翻译文本的方法
    t(key) {
        return this.translations[key] || key;
    }

    // 临时测试德语的方法
    testGerman() {
        console.log('Testing German language...');
        this.changeLanguage('de');
    }
}

// 等待DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 创建全局实例
    window.i18n = new I18nManager();
});
