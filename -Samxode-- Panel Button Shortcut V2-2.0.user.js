// ==UserScript==
// @name         <Samxode/> Panel Button Shortcut V2
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Advanced panel with customizable buttons, drag-drop sorting, themes, and smooth animations
// @author       SamXode
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // Configuration with localStorage to save settings
    const config = {
        themes: {
            dark: {
                background: 'rgba(25, 25, 25, 0.8)',
                buttonColor: '#444',
                buttonHoverColor: '#666',
                textColor: '#fff',
                accentColor: '#0d6efd',
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            },
            light: {
                background: 'rgba(245, 245, 245, 0.8)',
                buttonColor: '#e0e0e0',
                buttonHoverColor: '#d0d0d0',
                textColor: '#333',
                accentColor: '#0d6efd',
                shadowColor: 'rgba(0, 0, 0, 0.2)'
            },
            blue: {
                background: 'rgba(40, 72, 115, 0.8)',
                buttonColor: '#456990',
                buttonHoverColor: '#5588bb',
                textColor: '#fff',
                accentColor: '#F45B69',
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            },
            neon: {
                background: 'rgba(31, 17, 46, 0.8)',
                buttonColor: '#471069',
                buttonHoverColor: '#651E89',
                textColor: '#00FFFF',
                accentColor: '#FF00FF',
                shadowColor: 'rgba(0, 255, 255, 0.3)'
            }
        },
        getCurrentTheme: function() {
            const savedTheme = localStorage.getItem('samxoinPanelTheme') || 'dark';
            return this.themes[savedTheme];
        },
        setTheme: function(themeName) {
            if (this.themes[themeName]) {
                localStorage.setItem('samxoinPanelTheme', themeName);
                return this.themes[themeName];
            }
            return this.themes.dark;
        }
    };

    // Define icons for default buttons (using simple Unicode or emoji as placeholders)
    const iconMap = {
        'Calculator': '🧮',
        'Discord': '💬',
        'Gmail': '📧',
        'Telegram': '📱',
        'Notion': '📝',
        'YouTube': '▶️',
        'GitHub': '💻',
        'Twitter': '🐦',
        'Facebook': '👤',
        'Instagram': '📷',
        'LinkedIn': '👔',
        'Reddit': '🔴',
        'Amazon': '🛒',
        'Netflix': '🎬',
        'Spotify': '🎵',
        'Google': '🔍',
        'Wikipedia': '📚',
        'Trello': '📋'
    };

    // Variables
    let buttonHideTimeout, panelHideTimeout, count = 0;
    let currentTheme = config.getCurrentTheme();
    let isDragging = false;
    let draggedElement = null;
    let draggedElementIndex = -1;

    // Load custom buttons or use defaults
    let customButtons = JSON.parse(localStorage.getItem('samxoinCustomButtons')) || [
        { label: 'Calculator', icon: '🧮', action: 'openCalculator' },
        { label: 'Discord', icon: '💬', url: 'https://discord.com/channels/@me' },
        { label: 'Gmail', icon: '📧', url: 'https://mail.google.com' },
        { label: 'Telegram', icon: '📱', url: 'tg://', action: 'openTelegram' },
        { label: 'Notion', icon: '📝', action: 'openNotion' }
    ];

    // Load count from localStorage
    count = parseInt(localStorage.getItem('samxoinPanelCount')) || 0;

    // Create the panel
    const panel = document.createElement('div');
    Object.assign(panel.style, {
        position: 'fixed',
        bottom: '80px',
        left: '20px',
        zIndex: '9999',
        backgroundColor: currentTheme.background,
        color: currentTheme.textColor,
        padding: '15px',
        borderRadius: '16px',
        boxShadow: `0 4px 20px ${currentTheme.shadowColor}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        transition: 'all 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55)', // Spring-like animation
        transform: 'translateX(-350px)',
        opacity: '0',
        backdropFilter: 'blur(10px)',
        maxHeight: '80vh',
        overflowY: 'auto',
        userSelect: 'none'
    });

    // Control panel for customization
    const controlPanel = document.createElement('div');
    Object.assign(controlPanel.style, {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '10px',
        borderRadius: '12px',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        marginBottom: '10px'
    });

    // Theme selector
    const themeSelector = document.createElement('div');
    themeSelector.style.display = 'flex';
    themeSelector.style.gap = '8px';
    themeSelector.style.justifyContent = 'center';
    themeSelector.style.marginBottom = '8px';

    // Create theme options
    for (const themeName in config.themes) {
        const themeOption = document.createElement('div');
        Object.assign(themeOption.style, {
            width: '25px',
            height: '25px',
            backgroundColor: config.themes[themeName].background,
            border: `2px solid ${config.themes[themeName].accentColor}`,
            borderRadius: '50%',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        });

        // Highlight current theme
        if (localStorage.getItem('samxoinPanelTheme') === themeName) {
            themeOption.style.transform = 'scale(1.2)';
        }

        themeOption.onclick = () => {
            // Apply theme and save preference
            currentTheme = config.setTheme(themeName);
            applyTheme();

            // Update theme selection indicators
            document.querySelectorAll('[data-theme-selector]').forEach(el => {
                el.style.transform = 'scale(1)';
            });
            themeOption.style.transform = 'scale(1.2)';
        };

        // Add a data attribute for easy selection
        themeOption.setAttribute('data-theme-selector', themeName);
        themeSelector.appendChild(themeOption);
    }

    // Add new button control
    const addButtonControl = document.createElement('div');
    addButtonControl.style.display = 'flex';
    addButtonControl.style.gap = '8px';

    const newButtonInput = document.createElement('input');
    Object.assign(newButtonInput.style, {
        flex: '1',
        padding: '8px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: currentTheme.textColor
    });
    newButtonInput.placeholder = 'Button name';

    const newButtonUrlInput = document.createElement('input');
    Object.assign(newButtonUrlInput.style, {
        flex: '1',
        padding: '8px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: currentTheme.textColor
    });
    newButtonUrlInput.placeholder = 'URL';

    const addButtonBtn = document.createElement('button');
    Object.assign(addButtonBtn.style, {
        padding: '8px 12px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: currentTheme.accentColor,
        color: '#fff',
        cursor: 'pointer'
    });
    addButtonBtn.textContent = '+';
    addButtonBtn.onclick = () => {
        if (newButtonInput.value.trim() !== '') {
            const newButton = {
                label: newButtonInput.value.trim(),
                icon: iconMap[newButtonInput.value.trim()] || '🔗',
                url: newButtonUrlInput.value.trim() || `https://${newButtonInput.value.trim().toLowerCase()}.com`
            };

            customButtons.push(newButton);
            saveCustomButtons();
            renderButtons();

            newButtonInput.value = '';
            newButtonUrlInput.value = '';
        }
    };

    addButtonControl.appendChild(newButtonInput);
    addButtonControl.appendChild(newButtonUrlInput);
    addButtonControl.appendChild(addButtonBtn);

    // Instructions text
    const instructions = document.createElement('div');
    instructions.style.fontSize = '12px';
    instructions.style.textAlign = 'center';
    instructions.style.opacity = '0.7';
    instructions.textContent = 'Drag buttons to reorder, right-click to edit/delete';

    // Add components to control panel
    controlPanel.appendChild(themeSelector);
    controlPanel.appendChild(addButtonControl);
    controlPanel.appendChild(instructions);

    // Copyright text
    const copyright = document.createElement('div');
    Object.assign(copyright.style, {
        fontSize: '12px',
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'center',
        marginTop: '5px',
        padding: '5px',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
    });
    copyright.textContent = '<SamXode/>';

    // Counter display at the top
    const counterDisplay = document.createElement('div');
    Object.assign(counterDisplay.style, {
        fontSize: '18px',
        fontWeight: 'bold',
        color: currentTheme.accentColor,
        marginBottom: '10px',
        transition: 'transform 0.3s ease, color 0.3s ease', // Smooth transition for the count display
        textAlign: 'center'
    });
    counterDisplay.textContent = `Count: ${count}`;

    // Container for counter buttons
    const counterButtonContainer = document.createElement('div');
    counterButtonContainer.style.display = 'flex';
    counterButtonContainer.style.gap = '10px';
    counterButtonContainer.style.justifyContent = 'center';
    counterButtonContainer.style.marginBottom = '15px';

    // Create the buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.flexDirection = 'column';
    buttonsContainer.style.gap = '10px';

    // Add elements to panel
    panel.appendChild(controlPanel);
    panel.appendChild(counterDisplay);
    panel.appendChild(counterButtonContainer);
    panel.appendChild(buttonsContainer);
    panel.appendChild(copyright);

    // Reset Button
    const resetButton = document.createElement('button');
    resetButton.textContent = '🔄 Reset';
    Object.assign(resetButton.style, {
        backgroundColor: '#D9534F',
        border: 'none',
        color: 'white',
        padding: '8px 12px',
        textAlign: 'center',
        fontSize: '14px',
        cursor: 'pointer',
        borderRadius: '8px',
        transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55)', // Spring animation
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
    });

    resetButton.onclick = () => {
        count = 0;
        counterDisplay.textContent = `Count: ${count}`;
        localStorage.setItem('samxoinPanelCount', count);
        counterDisplay.style.color = currentTheme.accentColor;
        // Add animation on click
        resetButton.style.transform = 'scale(1.1) rotate(-360deg)';
        setTimeout(() => resetButton.style.transform = 'scale(1) rotate(0deg)', 500);
    };

    resetButton.onmouseenter = () => {
        resetButton.style.backgroundColor = '#C9302C';
        resetButton.style.transform = 'scale(1.05)';
    };
    resetButton.onmouseleave = () => {
        resetButton.style.backgroundColor = '#D9534F';
        resetButton.style.transform = 'scale(1)';
    };

    // Count +1 Button
    const countButton = document.createElement('button');
    countButton.innerHTML = '➕ Count';
    Object.assign(countButton.style, {
        backgroundColor: '#28a745',
        border: 'none',
        color: 'white',
        padding: '10px 15px',
        textAlign: 'center',
        fontSize: '14px',
        cursor: 'pointer',
        borderRadius: '8px',
        transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55)', // Spring animation
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
    });

    countButton.onclick = () => {
        count++;
        localStorage.setItem('samxoinPanelCount', count);
        counterDisplay.textContent = `Count: ${count}`;
        counterDisplay.style.color = '#28a745';
        // Add animation on click
        countButton.style.transform = 'scale(1.1)';
        setTimeout(() => countButton.style.transform = 'scale(1)', 200);
    };

    countButton.onmouseenter = () => {
        countButton.style.backgroundColor = '#218838';
        countButton.style.transform = 'scale(1.05)';
    };
    countButton.onmouseleave = () => {
        countButton.style.backgroundColor = '#28a745';
        countButton.style.transform = 'scale(1)';
    };

    counterButtonContainer.appendChild(resetButton);
    counterButtonContainer.appendChild(countButton);

    document.body.appendChild(panel);

    // Create a trigger button
    const triggerButton = document.createElement('button');
    triggerButton.innerHTML = '🛠️ Panel';

    // Detect page theme (light or dark) for the panel button
    const isPageDark = window.matchMedia('(prefers-color-scheme: dark)').matches ||
        getComputedStyle(document.body).backgroundColor === 'rgb(0, 0, 0)';

    // Adaptive colors for the button based on the theme
    const buttonBackgroundColor = isPageDark ? 'rgba(0, 123, 255, 0.2)' : 'rgba(255, 123, 0, 0.2)';
    const buttonTextColor = isPageDark ? '#fff' : '#000';
    const buttonHoverBackgroundColor = isPageDark ? 'rgba(0, 123, 255, 0.4)' : 'rgba(255, 123, 0, 0.4)';
    const buttonHoverTextColor = isPageDark ? '#fff' : '#000';

    Object.assign(triggerButton.style, {
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: '9999',
        padding: '12px 20px',
        backgroundColor: buttonBackgroundColor,
        color: buttonTextColor,
        border: 'none',
        fontSize: '16px',
        cursor: 'pointer',
        borderRadius: '50px',
        transition: 'all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)', // Spring animation
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
    });

    // Adjust button on hover (adaptive color change)
    triggerButton.onmouseenter = () => {
        clearTimeout(buttonHideTimeout);
        triggerButton.style.transform = 'translateX(0px) scale(1.05)';
        triggerButton.style.backgroundColor = buttonHoverBackgroundColor;
        triggerButton.style.color = buttonHoverTextColor;
        triggerButton.innerHTML = '🛠️ Panel';
    };

    triggerButton.onmouseleave = () => {
        startButtonHideTimer();
        triggerButton.style.transform = 'scale(1)';
        triggerButton.style.backgroundColor = buttonBackgroundColor;
        triggerButton.style.color = buttonTextColor;
    };

    triggerButton.onclick = () => {
        if (panel.style.transform === 'translateX(0px)') {
            hidePanel();
        } else {
            showPanel();
        }
    };

    document.body.appendChild(triggerButton);

    // Functions to show/hide panel with spring animation
    const showPanel = () => {
        clearTimeout(panelHideTimeout);
        panel.style.transform = 'translateX(0px)';
        panel.style.opacity = '1';
        startPanelHideTimer();
    };

    const hidePanel = () => {
        panel.style.transform = 'translateX(-350px)';
        panel.style.opacity = '0';
    };

    const startButtonHideTimer = () => {
        buttonHideTimeout = setTimeout(() => {
            triggerButton.style.transform = 'translateX(-60px)';
            triggerButton.innerHTML = '🛠️';
        }, 3000);
    };

    const startPanelHideTimer = () => {
        panelHideTimeout = setTimeout(hidePanel, 7000); // Extended to 7 seconds
    };

    // Save custom buttons to localStorage
    const saveCustomButtons = () => {
        localStorage.setItem('samxoinCustomButtons', JSON.stringify(customButtons));
    };

    // Apply theme to all elements
    const applyTheme = () => {
        // Panel theme
        Object.assign(panel.style, {
            backgroundColor: currentTheme.background,
            color: currentTheme.textColor,
            boxShadow: `0 4px 20px ${currentTheme.shadowColor}`
        });

        // Update counter display
        counterDisplay.style.color = currentTheme.accentColor;

        // Update button styles
        document.querySelectorAll('[data-custom-button]').forEach(btn => {
            btn.style.backgroundColor = currentTheme.buttonColor;
            btn.style.color = currentTheme.textColor;
        });

        // Update inputs
        newButtonInput.style.color = currentTheme.textColor;
        newButtonUrlInput.style.color = currentTheme.textColor;

        // Update copyright
        copyright.style.borderTopColor = `rgba(${currentTheme.textColor === '#fff' ? '255, 255, 255' : '0, 0, 0'}, 0.2)`;
        copyright.style.color = `rgba(${currentTheme.textColor === '#fff' ? '255, 255, 255' : '0, 0, 0'}, 0.7)`;
    };

    // Render all custom buttons
    const renderButtons = () => {
        // Clear existing buttons
        buttonsContainer.innerHTML = '';

        // Add all custom buttons
        customButtons.forEach((button, index) => {
            const btn = document.createElement('div');
            btn.setAttribute('data-custom-button', 'true');
            btn.setAttribute('data-button-index', index);
            Object.assign(btn.style, {
                backgroundColor: currentTheme.buttonColor,
                color: currentTheme.textColor,
                padding: '10px 15px',
                textAlign: 'left',
                fontSize: '14px',
                cursor: 'pointer',
                borderRadius: '8px',
                transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55)', // Spring animation
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                userSelect: 'none'
            });

            // Icon container
            const iconSpan = document.createElement('span');
            iconSpan.style.fontSize = '18px';
            iconSpan.style.width = '24px';
            iconSpan.style.display = 'inline-block';
            iconSpan.style.textAlign = 'center';
            iconSpan.textContent = button.icon || '🔗';

            // Label
            const labelSpan = document.createElement('span');
            labelSpan.style.flex = '1';
            labelSpan.textContent = button.label;

            // Drag handle
            const dragHandle = document.createElement('span');
            dragHandle.style.cursor = 'grab';
            dragHandle.style.opacity = '0.5';
            dragHandle.textContent = '⋮⋮';
            dragHandle.style.fontSize = '16px';

            btn.appendChild(iconSpan);
            btn.appendChild(labelSpan);
            btn.appendChild(dragHandle);

            // Button click function
            btn.onclick = (e) => {
                if (isDragging) return;

                // Execute button action
                if (button.url) {
                    window.open(button.url, '_blank');
                } else if (button.action === 'openTelegram') {
                    window.location.href = 'tg://';
                } else if (button.action === 'openCalculator') {
                    window.open('calculator:', '_blank');
                } else if (button.action === 'openNotion') {
                    window.open('https://www.notion.so', '_blank');
                }

                // Animation effect
                btn.style.transform = 'scale(1.05)';
                setTimeout(() => btn.style.transform = 'scale(1)', 200);
            };

            // Button hover effects
            btn.onmouseenter = () => {
                btn.style.backgroundColor = currentTheme.buttonHoverColor;
                btn.style.transform = 'scale(1.02)';
            };

            btn.onmouseleave = () => {
                btn.style.backgroundColor = currentTheme.buttonColor;
                btn.style.transform = 'scale(1)';
            };

            // Context menu for edit/delete
            btn.oncontextmenu = (e) => {
                e.preventDefault();
                const index = parseInt(btn.getAttribute('data-button-index'));
                showButtonMenu(e, index);
                return false;
            };

            // Drag start
            dragHandle.onmousedown = (e) => {
                e.stopPropagation();
                isDragging = true;
                draggedElement = btn;
                draggedElementIndex = index;

                // Visual feedback
                btn.style.opacity = '0.7';
                btn.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.5)';

                // Record initial position
                const initialY = e.clientY;

                // Move function
                const onMouseMove = (moveEvent) => {
                    const deltaY = moveEvent.clientY - initialY;
                    btn.style.transform = `translateY(${deltaY}px)`;

                    // Find drop position
                    const elements = [...buttonsContainer.querySelectorAll('[data-custom-button]')];
                    const positions = elements.map(el => {
                        const rect = el.getBoundingClientRect();
                        return rect.top + rect.height / 2;
                    });

                    let newPosition = -1;
                    for (let i = 0; i < positions.length; i++) {
                        if (i !== index && moveEvent.clientY < positions[i]) {
                            newPosition = i;
                            break;
                        }
                    }

                    if (newPosition === -1 && moveEvent.clientY > positions[positions.length - 1]) {
                        newPosition = positions.length - 1;
                    }

                    // Visual feedback for drop position
                    elements.forEach(el => {
                        el.style.borderTop = 'none';
                        el.style.borderBottom = 'none';
                    });

                    if (newPosition !== -1 && newPosition !== index) {
                        if (newPosition < index) {
                            elements[newPosition].style.borderTop = `2px solid ${currentTheme.accentColor}`;
                        } else {
                            elements[newPosition].style.borderBottom = `2px solid ${currentTheme.accentColor}`;
                        }
                    }
                };

                // Drop function
                const onMouseUp = () => {
                    isDragging = false;

                    // Visual reset
                    btn.style.opacity = '1';
                    btn.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';
                    btn.style.transform = 'scale(1)';

                    // Find drop position
                    const elements = [...buttonsContainer.querySelectorAll('[data-custom-button]')];
                    const positions = elements.map(el => {
                        const rect = el.getBoundingClientRect();
                        return rect.top + rect.height / 2;
                    });

                    let newPosition = -1;
                    for (let i = 0; i < positions.length; i++) {
                        if (i !== index && e.clientY < positions[i]) {
                            newPosition = i;
                            break;
                        }
                    }

                    if (newPosition === -1 && e.clientY > positions[positions.length - 1]) {
                        newPosition = positions.length - 1;
                    }

                    // Reorder if position changed
                    if (newPosition !== -1 && newPosition !== index) {
                        const movedButton = customButtons.splice(index, 1)[0];
                        customButtons.splice(newPosition, 0, movedButton);
                        saveCustomButtons();
                        renderButtons();
                    } else {
                        // Just remove visual feedback
                        elements.forEach(el => {
                            el.style.borderTop = 'none';
                            el.style.borderBottom = 'none';
                        });
                    }

                    // Remove listeners
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                };

                // Add document listeners
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            };

            buttonsContainer.appendChild(btn);
        });
    };

    // Function to show button edit/delete menu
    const showButtonMenu = (event, index) => {
        // Remove any existing menu
        const existingMenu = document.getElementById('samxoinButtonMenu');
        if (existingMenu) {
            existingMenu.remove();
        }

        // Create menu
        const menu = document.createElement('div');
        menu.id = 'samxoinButtonMenu';
        Object.assign(menu.style, {
            position: 'fixed',
            top: `${event.clientY}px`,
            left: `${event.clientX}px`,
            backgroundColor: currentTheme.background,
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
            borderRadius: '8px',
            padding: '8px',
            zIndex: '10000',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        });

        // Edit option
        const editOption = document.createElement('div');
        editOption.textContent = '✏️ Edit';
        Object.assign(editOption.style, {
            padding: '8px 12px',
            cursor: 'pointer',
            borderRadius: '4px',
            transition: 'background-color 0.2s ease'
        });

        editOption.onmouseenter = () => {
            editOption.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        };

        editOption.onmouseleave = () => {
            editOption.style.backgroundColor = 'transparent';
        };

        editOption.onclick = () => {
            menu.remove();
            showEditDialog(index);
        };

        // Delete option
        const deleteOption = document.createElement('div');
        deleteOption.textContent = '🗑️ Delete';
        Object.assign(deleteOption.style, {
            padding: '8px 12px',
            cursor: 'pointer',
            borderRadius: '4px',
            transition: 'background-color 0.2s ease',
            color: '#ff6b6b'
        });

        deleteOption.onmouseenter = () => {
            deleteOption.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        };

        deleteOption.onmouseleave = () => {
            deleteOption.style.backgroundColor = 'transparent';
        };

        deleteOption.onclick = () => {
            customButtons.splice(index, 1);
            saveCustomButtons();
            renderButtons();
            menu.remove();
        };

        menu.appendChild(editOption);
        menu.appendChild(deleteOption);
        document.body.appendChild(menu);

        // Close menu when clicking elsewhere
        const closeMenuListener = (e) => {
            if (!menu.contains(e.target) && e.target.id !== 'samxoinButtonMenu') {
                menu.remove();
                document.removeEventListener('click', closeMenuListener);
            }
        };

        setTimeout(() => {
            document.addEventListener('click', closeMenuListener);
        }, 100);
    };

    // Function to show edit dialog
    const showEditDialog = (index) => {
        const button = customButtons[index];

        // Create dialog
        const dialog = document.createElement('div');
        Object.assign(dialog.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: currentTheme.background,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            borderRadius: '12px',
            padding: '20px',
            zIndex: '10000',
            width: '300px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
        });

        // Label input
        const labelInput = document.createElement('input');
        Object.assign(labelInput.style, {
            padding: '10px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: currentTheme.textColor
        });
        labelInput.placeholder = 'Button name';
        labelInput.value = button.label;

        // URL input
        const urlInput = document.createElement('input');
        Object.assign(urlInput.style, {
            padding: '10px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: currentTheme.textColor
        });
        urlInput.placeholder = 'URL';
        urlInput.value = button.url || '';

        // Icon selector
        const iconSelector = document.createElement('div');
        Object.assign(iconSelector.style, {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            justifyContent: 'center',
            maxHeight: '100px',
            overflowY: 'auto',
            padding: '5px',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            borderRadius: '8px'
        });

        // Selected icon display
        const selectedIconDisplay = document.createElement('div');
        Object.assign(selectedIconDisplay.style, {
            padding: '8px',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
            fontSize: '24px'
        });
        selectedIconDisplay.textContent = button.icon;

        // Add popular icons
        for (const icon in iconMap) {
            const iconOption = document.createElement('span');
            Object.assign(iconOption.style, {
                fontSize: '18px',
                cursor: 'pointer',
                width: '30px',
                height: '30px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                transition: 'transform 0.2s ease'
            });
            iconOption.textContent = iconMap[icon];

            iconOption.onclick = () => {
                selectedIconDisplay.textContent = iconMap[icon];
            };

            iconOption.onmouseenter = () => {
                iconOption.style.transform = 'scale(1.2)';
            };

            iconOption.onmouseleave = () => {
                iconOption.style.transform = 'scale(1)';
            };

            iconSelector.appendChild(iconOption);
        }

        // Button container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.justifyContent = 'flex-end';

        // Cancel button
        const cancelButton = document.createElement('button');
        Object.assign(cancelButton.style, {
            padding: '8px 15px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '8px',
            color: currentTheme.textColor,
            cursor: 'pointer'
        });
        cancelButton.textContent = 'Cancel';

        cancelButton.onclick = () => {
            dialog.remove();
        };

        // Save button
        const saveButton = document.createElement('button');
        Object.assign(saveButton.style, {
            padding: '8px 15px',
            backgroundColor: currentTheme.accentColor,
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            cursor: 'pointer'
        });
        saveButton.textContent = 'Save';

        saveButton.onclick = () => {
            // Update button data
            customButtons[index] = {
                label: labelInput.value.trim() || 'Button',
                icon: selectedIconDisplay.textContent,
                url: urlInput.value.trim()
            };

            saveCustomButtons();
            renderButtons();
            dialog.remove();
        };

        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(saveButton);

        // Add all elements to dialog
        const dialogTitle = document.createElement('h3');
        dialogTitle.textContent = 'Edit Button';
        dialogTitle.style.margin = '0 0 10px 0';
        dialogTitle.style.textAlign = 'center';
        dialogTitle.style.color = currentTheme.textColor;

        dialog.appendChild(dialogTitle);
        dialog.appendChild(labelInput);
        dialog.appendChild(urlInput);
        dialog.appendChild(selectedIconDisplay);
        dialog.appendChild(iconSelector);
        dialog.appendChild(buttonContainer);

        document.body.appendChild(dialog);

        // Close dialog when clicking outside
        const backdropOverlay = document.createElement('div');
        Object.assign(backdropOverlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: '9999'
        });

        document.body.appendChild(backdropOverlay);
        document.body.appendChild(dialog);

        backdropOverlay.onclick = () => {
            dialog.remove();
            backdropOverlay.remove();
        };
    };

    // Create keyboard shortcut
    document.addEventListener('keydown', (e) => {
        // Alt+P shortcut
        if (e.altKey && e.key === 'p') {
            if (panel.style.transform === 'translateX(0px)') {
                hidePanel();
            } else {
                showPanel();
            }
        }
    });

    // Panel interactions - prevent hiding when in use
    panel.onmouseenter = () => {
        clearTimeout(panelHideTimeout);
    };

    panel.onmouseleave = () => {
        startPanelHideTimer();
    };

    // Initialize the UI
    startButtonHideTimer();
    renderButtons();

    // Log initialization
    console.log('SamXode Panel initialized.');
})();