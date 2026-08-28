        document.addEventListener('DOMContentLoaded', () => {

            // Dynamically calculate years of experience since April 2021
            let yearsOfExp = 5;
            const expCounterElement = document.querySelector('.stat-num[data-target][data-suffix="+"]');
            if (expCounterElement) {
                const startDate = new Date('2021-04-01'); // Started working in April 2021
                const today = new Date();
                let yearsOfExperience = today.getFullYear() - startDate.getFullYear();
                
                // Adjust if today's date is before April 1st in the current year
                const hasNotPassedMonth = today.getMonth() < startDate.getMonth();
                if (hasNotPassedMonth) {
                    yearsOfExperience--;
                }
                
                yearsOfExp = Math.max(1, yearsOfExperience);
                expCounterElement.setAttribute('data-target', yearsOfExp);
            }

            /* ── 3D HOVER TILT FOR CARDS ── */
            const glowCards = document.querySelectorAll('.glow-card');
            if (!window.matchMedia('(hover: none)').matches) {
                glowCards.forEach(card => {
                    card.addEventListener('mousemove', (e) => {
                        const rect = card.getBoundingClientRect();
                        const width = rect.width;
                        const height = rect.height;
                        
                        const mouseX = e.clientX - rect.left - width / 2;
                        const mouseY = e.clientY - rect.top - height / 2;
                        
                        // Subtle, premium tilt angle (max 6 degrees)
                        const rotateX = -(mouseY / (height / 2)) * 6;
                        const rotateY = (mouseX / (width / 2)) * 6;
                        
                        card.style.transition = 'transform 0.05s linear'; // high-performance tracking transition
                        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px) scale(1.015)`;
                    });
                    
                    card.addEventListener('mouseleave', () => {
                        card.style.transition = 'transform 0.5s var(--ease), box-shadow 0.4s var(--ease), border-color 0.4s var(--ease)';
                        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
                    });
                });
            }

            /* ── 3D HERO PHOTO PARALLAX TILT ── */
            const heroPhotoWrapper = document.querySelector('.hero-photo-wrapper');
            const heroPhoto = document.querySelector('.hero-photo-wrapper img');
            if (heroPhotoWrapper && heroPhoto && !window.matchMedia('(hover: none)').matches) {
                heroPhotoWrapper.style.perspective = '1000px';
                heroPhotoWrapper.style.transformStyle = 'preserve-3d';
                heroPhoto.style.transformStyle = 'preserve-3d';
                
                heroPhotoWrapper.addEventListener('mousemove', (e) => {
                    const rect = heroPhotoWrapper.getBoundingClientRect();
                    const width = rect.width;
                    const height = rect.height;
                    
                    const mouseX = (e.clientX - rect.left) / width - 0.5;
                    const mouseY = (e.clientY - rect.top) / height - 0.5;
                    
                    const rotateX = -mouseY * 8; // subtle 3D tilt
                    const rotateY = mouseX * 8;
                    const moveX = mouseX * 12;
                    const moveY = mouseY * 12;
                    
                    heroPhoto.style.transition = 'transform 0.05s linear';
                    heroPhoto.style.transform = `perspective(1000px) scale(1.04) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translate(${moveX.toFixed(1)}px, ${moveY.toFixed(1)}px)`;
                });
                
                heroPhotoWrapper.addEventListener('mouseleave', () => {
                    heroPhoto.style.transition = 'transform 0.6s var(--ease)';
                    heroPhoto.style.transform = 'perspective(1000px) scale(1) rotateX(0deg) rotateY(0deg) translate(0px, 0px)';
                });
            }

            /* ── PRELOADER PROGRESS & HERO STAGGER ── */
            const preloader = document.getElementById('preloader');
            const progressBar = document.querySelector('.loader-progress-bar');
            const percentText = document.querySelector('.loader-percent');
            let progress = 0;

            const preloaderInterval = setInterval(() => {
                progress += Math.floor(Math.random() * 12) + 5;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(preloaderInterval);

                    if (progressBar && percentText) {
                        progressBar.style.width = '100%';
                        percentText.textContent = '100%';
                    }

                    setTimeout(() => {
                        if (preloader) preloader.classList.add('loaded');
                        // Trigger hero staggered entrance reveals
                        document.querySelectorAll('.hero .stagger-item').forEach(item => {
                            item.classList.add('active');
                        });
                    }, 350);
                } else {
                    if (progressBar && percentText) {
                        progressBar.style.width = `${progress}%`;
                        percentText.textContent = `${progress}%`;
                    }
                }
            }, 50);


            /* ── INTERACTIVE CANVAS PARTICLES (HERO BG) ── */
            const canvas = document.getElementById('hero-canvas');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                let width = canvas.width = canvas.offsetWidth;
                let height = canvas.height = canvas.offsetHeight;

                window.addEventListener('resize', () => {
                    width = canvas.width = canvas.offsetWidth;
                    height = canvas.height = canvas.offsetHeight;
                });

                const particles = [];
                const particleCount = Math.min(50, Math.floor((width * height) / 16000));
                const connectionDistance = 105;
                let mouse = { x: null, y: null, radius: 140 };

                const heroSection = document.querySelector('.hero');
                if (heroSection) {
                    heroSection.addEventListener('mousemove', (e) => {
                        const rect = heroSection.getBoundingClientRect();
                        mouse.x = e.clientX - rect.left;
                        mouse.y = e.clientY - rect.top;
                    });

                    heroSection.addEventListener('mouseleave', () => {
                        mouse.x = null;
                        mouse.y = null;
                    });
                }

                class Particle {
                    constructor() {
                        this.x = Math.random() * width;
                        this.y = Math.random() * height;
                        this.vx = (Math.random() - 0.5) * 0.35;
                        this.vy = (Math.random() - 0.5) * 0.35;
                        this.size = Math.random() * 1.8 + 1.2;
                        this.color = Math.random() > 0.45 ? 'rgba(245, 158, 11, 0.45)' : 'rgba(255, 255, 255, 0.2)';
                    }

                    update() {
                        this.x += this.vx;
                        this.y += this.vy;

                        if (this.x < 0 || this.x > width) this.vx *= -1;
                        if (this.y < 0 || this.y > height) this.vy *= -1;

                        if (mouse.x !== null && mouse.y !== null) {
                            const dx = mouse.x - this.x;
                            const dy = mouse.y - this.y;
                            const dist = Math.sqrt(dx * dx + dy * dy);
                            if (dist < mouse.radius) {
                                const force = (mouse.radius - dist) / mouse.radius;
                                this.x += (dx / dist) * force * 0.7;
                                this.y += (dy / dist) * force * 0.7;
                            }
                        }
                    }

                    draw() {
                        ctx.beginPath();
                        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                        ctx.fillStyle = this.color;
                        ctx.fill();
                    }
                }

                for (let i = 0; i < particleCount; i++) {
                    particles.push(new Particle());
                }

                function animateParticles() {
                    ctx.clearRect(0, 0, width, height);

                    for (let i = 0; i < particles.length; i++) {
                        particles[i].update();
                        particles[i].draw();

                        for (let j = i + 1; j < particles.length; j++) {
                            const dx = particles[i].x - particles[j].x;
                            const dy = particles[i].y - particles[j].y;
                            const dist = Math.sqrt(dx * dx + dy * dy);

                            if (dist < connectionDistance) {
                                ctx.beginPath();
                                ctx.moveTo(particles[i].x, particles[i].y);
                                ctx.lineTo(particles[j].x, particles[j].y);
                                const alpha = (1 - dist / connectionDistance) * 0.12;
                                ctx.strokeStyle = `rgba(245, 158, 11, ${alpha})`;
                                ctx.lineWidth = 0.7;
                                ctx.stroke();
                            }
                        }
                    }

                    requestAnimationFrame(animateParticles);
                }

                animateParticles();
            }




            /* ── BUTTON CLICK ELECTRICAL SPARK BURST ── */
            document.addEventListener('click', (e) => {
                const button = e.target.closest('.btn-primary, .btn-submit, .btn-ghost, .qty-btn, .chip-btn, .nav-cta, .whatsapp-dynamic');
                if (!button) return;

                const clickX = e.clientX;
                const clickY = e.clientY;
                const sparkCount = 14;

                for (let i = 0; i < sparkCount; i++) {
                    const spark = document.createElement('div');
                    spark.className = 'spark-particle';

                    const size = Math.random() * 3 + 1.5;
                    spark.style.width = `${size}px`;
                    spark.style.height = `${size}px`;
                    spark.style.left = `${clickX}px`;
                    spark.style.top = `${clickY}px`;

                    const angle = Math.random() * Math.PI * 2;
                    const distance = Math.random() * 55 + 25;
                    const dx = Math.cos(angle) * distance;
                    const dy = Math.sin(angle) * distance;

                    spark.style.setProperty('--dx', `${dx}px`);
                    spark.style.setProperty('--dy', `${dy}px`);

                    const colors = ['#f59e0b', '#fbbf24', '#ffffff', '#d97706'];
                    spark.style.background = colors[Math.floor(Math.random() * colors.length)];

                    document.body.appendChild(spark);

                    spark.addEventListener('animationend', () => {
                        spark.remove();
                    });
                }
            });


            /* ── MOBILE MENU TOGGLE ── */
            const hamburger = document.querySelector('.hamburger');
            const navLinks = document.querySelector('.nav-links');
            const navLinksItems = document.querySelectorAll('.nav-links a');

            if (hamburger && navLinks) {
                hamburger.addEventListener('click', () => {
                    hamburger.classList.toggle('active');
                    navLinks.classList.toggle('active');
                });
            }

            if (navLinksItems) {
                navLinksItems.forEach(item => {
                    item.addEventListener('click', () => {
                        if (hamburger) hamburger.classList.remove('active');
                        if (navLinks) navLinks.classList.remove('active');
                    });
                });
            }


            /* ── SCROLL REVEAL ANIMATION ── */
            const reveals = document.querySelectorAll('.reveal');
            const revealOnScroll = () => {
                reveals.forEach(el => {
                    const windowHeight = window.innerHeight;
                    const elementTop = el.getBoundingClientRect().top;
                    const elementVisible = 120; // threshold in px

                    if (elementTop < windowHeight - elementVisible) {
                        el.classList.add('visible');
                        
                        // Animate skill bars if this is a skill card
                        const skillBars = el.querySelectorAll('.skill-bar-fill');
                        if (skillBars.length > 0) {
                            skillBars.forEach(bar => {
                                const targetWidth = bar.getAttribute('data-width');
                                bar.style.width = targetWidth;
                            });
                        }

                        // Animate stats counters if present
                        const counters = el.querySelectorAll('.animate-counter');
                        if (counters.length > 0) {
                            counters.forEach(counter => {
                                if (counter.classList.contains('counted')) return;
                                counter.classList.add('counted');
                                const target = parseInt(counter.getAttribute('data-target'), 10);
                                const suffix = counter.getAttribute('data-suffix') || '';
                                let current = 0;
                                const duration = 1500; // 1.5 seconds
                                const startTime = performance.now();
                                
                                const updateCounter = (currentTime) => {
                                    const elapsedTime = currentTime - startTime;
                                    const progress = Math.min(elapsedTime / duration, 1);
                                    const easeProgress = progress * (2 - progress); // ease out quad
                                    current = Math.floor(easeProgress * target);
                                    counter.textContent = current + suffix;
                                    
                                    if (progress < 1) {
                                        requestAnimationFrame(updateCounter);
                                    } else {
                                        counter.textContent = target + suffix;
                                    }
                                };
                                requestAnimationFrame(updateCounter);
                            });
                        }
                    }
                });
            };

            window.addEventListener('scroll', revealOnScroll);
            setTimeout(revealOnScroll, 150);


            /* ── INTERACTIVE TROUBLESHOOTER ── */
            const troubleSteps = document.querySelectorAll('.trouble-step');
            let currentStep = 'step-1';
            let stepHistory = [];

            const showStep = (stepId) => {
                troubleSteps.forEach(step => {
                    step.classList.remove('active');
                    if (step.id === stepId) {
                        step.classList.add('active');
                    }
                });
                currentStep = stepId;
            };

            // Event listeners for option buttons
            document.querySelectorAll('.trouble-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const nextStep = button.getAttribute('data-next');
                    if (nextStep) {
                        stepHistory.push(currentStep);
                        showStep(nextStep);
                    }
                });
            });

            // Back button logic
            document.querySelectorAll('.btn-back').forEach(button => {
                button.addEventListener('click', () => {
                    if (stepHistory.length > 0) {
                        const prevStep = stepHistory.pop();
                        showStep(prevStep);
                    }
                });
            });

            // Restart button logic
            document.querySelectorAll('.btn-restart').forEach(button => {
                button.addEventListener('click', () => {
                    stepHistory = [];
                    showStep('step-1');
                });
            });


            /* ── ELECTRICAL LOAD ESTIMATOR ── */
            const appliances = {
                ac: { watts: 3000, qty: 0 },
                heater: { watts: 1500, qty: 0 },
                fan: { watts: 75, qty: 0 },
                light: { watts: 50, qty: 0 },
                fridge: { watts: 400, qty: 0 },
                wm: { watts: 1000, qty: 0 },
                microwave: { watts: 1200, qty: 0 },
                pump: { watts: 750, qty: 0 }
            };

            const totalLoadEl = document.getElementById('total-load');
            const recommendedPhaseEl = document.getElementById('recommended-phase');
            const verdictBoxEl = document.getElementById('verdict-box');

            const updateCalculator = () => {
                let totalWatts = 0;
                
                // Calculate total load
                for (const key in appliances) {
                    totalWatts += appliances[key].watts * appliances[key].qty;
                }

                const kw = (totalWatts / 1000).toFixed(2);
                totalLoadEl.textContent = kw;

                // Phase recommendation
                let phase = "Single Phase (220V)";
                let verdict = "Your total electrical load is within standard residential limits. <strong>Standard maintenance and checkups</strong> are recommended annually to ensure contact tightness and avoid insulation failures.";
                
                if (totalWatts > 10000) {
                    phase = "Three Phase (400V)";
                    verdict = "High load detected! It is highly recommended to use a <strong>Three-Phase Distribution Board</strong> to balance the load evenly across all three phases (R, Y, B) to prevent frequent neutral wire overheating and circuit breakers tripping.";
                } else if (totalWatts === 0) {
                    phase = "—";
                    verdict = "Select household appliances above to calculate your estimated electrical load and receive a custom recommendation.";
                }

                recommendedPhaseEl.textContent = phase;
                verdictBoxEl.innerHTML = verdict;
            };

            // Plus/Minus Button Event Listeners
            document.querySelectorAll('.qty-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const key = button.getAttribute('data-appliance');
                    const action = button.getAttribute('data-action');
                    const qtyValEl = document.getElementById(`qty-${key}`);

                    if (action === 'plus') {
                        appliances[key].qty++;
                    } else if (action === 'minus' && appliances[key].qty > 0) {
                        appliances[key].qty--;
                    }

                    qtyValEl.value = appliances[key].qty;
                    updateCalculator();
                });
            });

            // Direct Keyboard Input Listeners
            document.querySelectorAll('.qty-val').forEach(input => {
                input.addEventListener('input', () => {
                    const key = input.id.replace('qty-', '');
                    let val = parseInt(input.value, 10);
                    if (isNaN(val) || val < 0) {
                        val = 0;
                    } else if (val > 999) {
                        val = 999;
                    }
                    appliances[key].qty = val;
                    updateCalculator();
                });
                
                input.addEventListener('blur', () => {
                    if (input.value === '') {
                        input.value = '0';
                        const key = input.id.replace('qty-', '');
                        appliances[key].qty = 0;
                        updateCalculator();
                    }
                });
            });

            // Initialize Calculator
            updateCalculator();


            /* ── DYNAMIC WHATSAPP LINK PRE-FILL ── */
            const uaeWhatsAppBase = "https://wa.me/971526393293";
            
            // Quick helper to format text and update links if necessary
            const getPreFilledWhatsAppLink = (message) => {
                return `${uaeWhatsAppBase}?text=${encodeURIComponent(message)}`;
            };

            // Update main hire/contact links with pre-filled text
            const contactLinks = document.querySelectorAll('.whatsapp-dynamic');
            contactLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    const serviceType = link.getAttribute('data-service');
                    let message = "Hi Ahammed, I visited your website and would like to inquire about your electrical services.";
                    
                    if (serviceType === 'tripping') {
                        message = "Hi Ahammed, my circuit breaker is frequently tripping and I need an urgent fault diagnosis at my villa.";
                    } else if (serviceType === 'villa') {
                        message = "Hi Ahammed, I am looking for an electrician to work on a new villa construction wiring project.";
                    } else if (serviceType === 'maintenance') {
                        message = "Hi Ahammed, I need routine building electrical maintenance and repairs.";
                    }

                    window.open(getPreFilledWhatsAppLink(message), '_blank');
                });
            });


            /* ── AJAX FORM SUBMISSION (No Page Redirection) ── */
            const contactForm = document.querySelector('.contact-form-wrapper form');
            const submitBtn = contactForm ? contactForm.querySelector('.btn-submit') : null;
            const toastContainer = document.getElementById('toast-container');
            const toastIcon = toastContainer ? toastContainer.querySelector('.toast-icon') : null;
            const toastMessage = toastContainer ? toastContainer.querySelector('.toast-message') : null;
            let toastTimeout;

            const showNotification = (type, message) => {
                if (!toastContainer || !toastIcon || !toastMessage) return;
                
                clearTimeout(toastTimeout);
                
                // Reset classes
                toastContainer.className = 'toast-notification';
                toastContainer.classList.add(type);
                
                // Set icon
                if (type === 'success') {
                    toastIcon.className = 'toast-icon fa-solid fa-circle-check';
                } else {
                    toastIcon.className = 'toast-icon fa-solid fa-circle-xmark';
                }
                
                toastMessage.textContent = message;
                
                // Show toast
                toastContainer.classList.add('show');
                
                // Hide after 5 seconds
                toastTimeout = setTimeout(() => {
                    toastContainer.classList.remove('show');
                }, 5000);
            };

            if (contactForm && submitBtn) {
                contactForm.addEventListener('submit', (e) => {
                    e.preventDefault(); // Prevent standard redirect / reload
                    
                    // Set button loading state
                    const originalBtnText = submitBtn.innerHTML;
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = 'Sending Message... <i class="fa-solid fa-circle-notch fa-spin" style="margin-left: 8px;"></i>';
                    
                    // Format data as JSON for FormSubmit AJAX API
                    const formData = new FormData(contactForm);
                    const data = {};
                    formData.forEach((value, key) => {
                        data[key] = value;
                    });
                    
                    // Post to FormSubmit AJAX endpoint
                    fetch('https://formsubmit.co/ajax/52d0584fb92ff45a5042843fe8e2076e', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(data)
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(result => {
                        // FormSubmit returns result.success as a string "true" or boolean true
                        if (result.success === 'true' || result.success === true) {
                            showNotification('success', 'Message sent successfully! Ahammed will get back to you soon.');
                            contactForm.reset();
                        } else {
                            showNotification('error', 'Failed to send message. Please try again or use WhatsApp.');
                        }
                    })
                    .catch(error => {
                        console.error('Error submitting form:', error);
                        showNotification('error', 'Connection issue. Please try again or contact via WhatsApp.');
                    })
                    .finally(() => {
                        // Reset button loading state
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                    });
                });
            }


            /* ── AI ROBOT CHATBOT ASSISTANT ── */
            const robotLauncher = document.querySelector('.robot-launcher');
            const robotChatWindow = document.querySelector('.robot-chat-window');
            const robotCloseBtn = document.querySelector('.robot-close-btn');
            const robotSettingsBtn = document.querySelector('.robot-settings-btn');
            const robotSettingsPanel = document.querySelector('.robot-settings-panel');
            const geminiKeyInput = document.getElementById('gemini-key-input');
            const saveKeyBtn = document.getElementById('save-key-btn');
            const keyStatusMsg = document.getElementById('key-status-msg');

            const robotChatMessages = document.querySelector('.robot-chat-messages');
            const robotChatInput = document.getElementById('robot-chat-input');
            const robotSendBtn = document.getElementById('robot-send-btn');
            const robotMicBtn = document.getElementById('robot-mic-btn');
            const chipBtns = document.querySelectorAll('.chip-btn');

            // ====== VOICE TYPING (Speech-to-Text) ======
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            let recognition = null;
            let isListening = false;

            if (SpeechRecognition && robotMicBtn) {
                recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = true;
                recognition.lang = 'en-US';
                recognition.maxAlternatives = 1;

                recognition.onstart = () => {
                    isListening = true;
                    robotMicBtn.classList.add('listening');
                    robotChatInput.placeholder = '\u{1F3A4} Listening...';
                };

                recognition.onresult = (event) => {
                    let interimTranscript = '';
                    let finalTranscript = '';
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        const transcript = event.results[i][0].transcript;
                        if (event.results[i].isFinal) {
                            finalTranscript += transcript;
                        } else {
                            interimTranscript += transcript;
                        }
                    }
                    // Show interim results in the input field
                    robotChatInput.value = finalTranscript || interimTranscript;

                    // If we have a final result, auto-send after a short delay
                    if (finalTranscript.trim()) {
                        setTimeout(() => {
                            if (robotChatInput.value.trim()) {
                                handleUserInput();
                            }
                        }, 500);
                    }
                };

                recognition.onerror = (event) => {
                    isListening = false;
                    robotMicBtn.classList.remove('listening');
                    robotChatInput.placeholder = 'Type a question...';
                    if (event.error === 'not-allowed') {
                        addBotMessage('\u{1F50A} Microphone access denied. Please allow mic permission in your browser settings.');
                    } else if (event.error !== 'aborted' && event.error !== 'no-speech') {
                        addBotMessage('\u{1F50A} Voice recognition error: ' + event.error + '. Try again!');
                    }
                };

                recognition.onend = () => {
                    isListening = false;
                    robotMicBtn.classList.remove('listening');
                    robotChatInput.placeholder = 'Type a question...';
                };

                robotMicBtn.addEventListener('click', () => {
                    if (isListening) {
                        recognition.stop();
                    } else {
                        robotChatInput.value = '';
                        recognition.start();
                    }
                });
            } else if (robotMicBtn) {
                // Browser doesn't support Speech Recognition
                robotMicBtn.classList.add('mic-unsupported');
            }

            let isChatOpen = false;
            let isTyping = false;
            const hardcodedKey = "AQ.Ab8RN6JSw9HXU2StQPcW-o9duYmV-G7BzI8YrrTHQjWagwkHfg";
            let geminiApiKey = localStorage.getItem('gemini_api_key');
            
            // If they have the old invalid key saved, or no key, force the new valid one
            if (!geminiApiKey || geminiApiKey === "AQ.Ab8RN6J3_0UhfTZaN6o9fTqGQYxaTzET_upbK0EsaWJy17bTxw") {
                geminiApiKey = hardcodedKey;
                localStorage.setItem('gemini_api_key', hardcodedKey);
            }

            // Initialize input value if key is saved
            if (geminiApiKey && geminiKeyInput) {
                geminiKeyInput.value = geminiApiKey;
                if (keyStatusMsg) {
                    keyStatusMsg.textContent = "Smart AI mode is active! \u{1F680}";
                    keyStatusMsg.style.color = "var(--green)";
                }
            }

            // Toggle Settings Panel
            if (robotSettingsBtn && robotSettingsPanel) {
                robotSettingsBtn.addEventListener('click', () => {
                    robotSettingsPanel.classList.toggle('active');
                    if (robotSettingsPanel.classList.contains('active') && geminiKeyInput) {
                        geminiKeyInput.focus();
                    }
                });
            }

            // Save Key Handler
            if (saveKeyBtn && geminiKeyInput && keyStatusMsg) {
                saveKeyBtn.addEventListener('click', () => {
                    const enteredKey = geminiKeyInput.value.trim();
                    if (enteredKey) {
                        localStorage.setItem('gemini_api_key', enteredKey);
                        geminiApiKey = enteredKey;
                        keyStatusMsg.textContent = "API key saved! Smart AI active. \u{1F680}";
                        keyStatusMsg.style.color = "var(--green)";
                        
                        // Close settings panel after a short delay
                        setTimeout(() => {
                            robotSettingsPanel.classList.remove('active');
                        }, 1000);
                    } else {
                        localStorage.removeItem('gemini_api_key');
                        geminiApiKey = "";
                        keyStatusMsg.textContent = "API key cleared. Fallback mode active.";
                        keyStatusMsg.style.color = "var(--lo)";
                    }
                });
            }

            // ====== AUTO-UPDATING BCA PROGRESS CALCULATOR ======
            // Automatically determines current semester, subjects, exam dates based on today's date.
            // Manipal University Jaipur Online BCA: 6 semesters, exams ~Feb and ~Aug each year.
            const getBCAProgress = () => {
                const now = new Date();
                const semesters = [
                    { sem: 1, start: new Date(2025, 4, 1), examStart: new Date(2026, 0, 15), end: new Date(2026, 1, 28),
                      subjects: "Fundamentals of IT & Computing, Programming in C, Basic Mathematics, Understanding PC & Troubleshooting, Programming in C (Virtual Lab)",
                      networking: "IT fundamentals, C programming, and PC troubleshooting" },
                    { sem: 2, start: new Date(2026, 1, 1), examStart: new Date(2026, 7, 1), end: new Date(2026, 7, 31),
                      subjects: "Operating Systems, Data Structure & Algorithms, OOP with C++, Digital Logic, Data Structure & Algorithms (Virtual Lab with C++), Communication Skills & Personality Development",
                      networking: "operating systems, data structures & algorithms, OOP with C++, and digital logic" },
                    { sem: 3, start: new Date(2026, 8, 1), examStart: new Date(2027, 1, 1), end: new Date(2027, 1, 28),
                      subjects: "Computer-Oriented Numerical Methods, Database Management Systems (DBMS), Computer Organisation, Basics of Data Communication, DBMS (Virtual Lab)",
                      networking: "Basics of Data Communication, DBMS, and computer organisation" },
                    { sem: 4, start: new Date(2027, 2, 1), examStart: new Date(2027, 7, 1), end: new Date(2027, 7, 31),
                      subjects: "Java Programming (Virtual Lab), System Software Programming, Principles of Financial Accounting & Management, Computer Networking",
                      networking: "Computer Networking, Java programming, and system software" },
                    { sem: 5, start: new Date(2027, 8, 1), examStart: new Date(2028, 1, 1), end: new Date(2028, 1, 29),
                      subjects: "Web Design (Virtual Lab), Visual Programming (Virtual Lab), Software Engineering, Python Programming (Virtual Lab), + 1 Elective",
                      networking: "web design, Python programming, software engineering, and visual programming" },
                    { sem: 6, start: new Date(2028, 2, 1), examStart: new Date(2028, 7, 1), end: new Date(2028, 7, 31),
                      subjects: "Major Project, Mobile Application Development (Workshop), Elective Subjects",
                      networking: "his major project and mobile application development" }
                ];

                // Check if graduated
                if (now > semesters[5].end) {
                    return { graduated: true, sem: 6, subjects: 'Completed all semesters',
                        examStatus: '', networking: 'all networking and IT subjects',
                        nextSem: null, nextSubjects: null, nextNetworking: null,
                        allSemesters: semesters };
                }

                // Find current semester
                let current = semesters[0];
                for (const s of semesters) {
                    if (now >= s.start && now <= s.end) { current = s; break; }
                    if (now < s.start) break;
                    current = s;
                }

                // Exam proximity check
                const msPerDay = 86400000;
                const daysToExam = Math.ceil((current.examStart - now) / msPerDay);
                let examStatus = '';
                const examMonth = current.examStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                if (daysToExam > 30) {
                    examStatus = 'Semester ' + current.sem + ' exams scheduled for ' + examMonth + '.';
                } else if (daysToExam > 0) {
                    examStatus = 'Semester ' + current.sem + ' exams start in ' + daysToExam + ' days (' + examMonth + ')!';
                } else {
                    examStatus = 'Currently in Semester ' + current.sem + ' exam period!';
                }

                const next = current.sem < 6 ? semesters[current.sem] : null;

                return {
                    graduated: false, sem: current.sem, subjects: current.subjects,
                    networking: current.networking, examStatus: examStatus,
                    nextSem: next ? next.sem : null, nextSubjects: next ? next.subjects : null,
                    nextNetworking: next ? next.networking : null,
                    allSemesters: semesters
                };
            };

            const bcaInfo = getBCAProgress();

            // Responses Database (Local Fallback)
            const answers = {
                greeting: "Hi there! Sugano? (How are you?) \u{1F60A} I am Sparky! I would love to chat, but it seems my AI brain is currently offline (API key error). Please chat with Ahammed directly on WhatsApp!",
                marital: "Ahammed Kabeer is currently single (unmarried) and actively seeking a partner for marriage! Matrimonial proposals are welcome. \u{1F48D} Warning: First dates might involve a detailed tour of a three-phase distribution board! Contact him on WhatsApp (+971 52 639 3293) for details.",
                welcome: "Hi! I am Ahammed\u0027s AI Assistant. \u{1F916} Ask me anything! I know electrical wiring, plumbing leaks, and computer programming. Just don\u0027t ask me to fix a short circuit myself, I might crash! \u{26A1}",
                name: "Ahammed Kabeer is a professional Residential Electrician & Plumbing Specialist based in Umm Al Quwain, UAE. He has " + (typeof yearsOfExp !== 'undefined' ? yearsOfExp : 5) + "+ years of UAE experience. He is basically the guy you call before your house turns into a swimming pool or a fireworks show! \u{1F386}",
                experience: "Ahammed has " + (typeof yearsOfExp !== 'undefined' ? yearsOfExp : 5) + "+ years of experience in the UAE. He currently works at Blix Contracting and Building Maintenance LLC, and previously worked at Almur Realestate in Dubai. He has seen enough tripped breakers to write a book about it! \u{1F4D6}",
                location: "He is based in Al Muqta 1, Umm Al Quwain (UAQ). He\u0027s ready to travel all over UAQ to tackle stubborn electrical faults and pipes! \u{1F697}",
                license: "Yes! He holds a valid Wireman Permit License from the Kerala State Electricity Licensing Board, India. This means he is legally authorized to handle high voltages so you don\u0027t get shocked! \u{26A1}",
                bca: bcaInfo.graduated
                    ? "Ahammed has completed his Bachelor of Computer Application (BCA) from Manipal University Jaipur, India! \u{1F393} He studied Data Communication & Protocols, Network Security, Wireless Communication, Cloud Computing, Machine Learning, and more. From copper wiring to code\u2014he\u0027s a fully certified tech hybrid now! \u{1F4A1}"
                    : "He is currently in Semester " + bcaInfo.sem + " of his BCA at Manipal University Jaipur, India (started May 2025). \u{1F4DA} " + bcaInfo.examStatus + " Current subjects: " + bcaInfo.subjects + ". He\u0027s upgrading from copper wiring to programming code\u2014soon he\u0027ll be programming light bulbs to argue with you! \u{1F4A1}",
                computer: "Yes, he knows IT! Between networking administration, Tally ERP, and his BCA studies, he is certified in both hardware wiring and software coding. A true tech hybrid! \u{1F4BB}",
                plumbing: "Along with electrical work, he\u0027s certified in plumbing from Regional College of Engineering, Tirur (2017-2018). He fixes everything from leaking pipes to faulty water pumps. No leakage can escape him! \u{1F6B0}",
                company: "He works for Blix Contracting and Building Maintenance LLC. Check them out at https://blixservices.ae. They keep Umm Al Quwain\u0027s buildings standing and fully powered! \u{1F3E2}",
                contact: "You can email him at ahammedkabeer200@gmail.com, or use the WhatsApp buttons on this page. Send him a message before your breaker trips again! \u{26A1}",
                services: "He specializes in distribution board (DB) dressing, villa layout conduits, insulation testing (Megger), fault diagnosis (tripping breakers), and plumbing repairs. Basically, all the home-maintenance superpowers! \u{1F9B8}",
                charges: "Charges depend on the scope of work. Send details via the contact form or WhatsApp for a quote. Don\u0027t worry, his rates are very reasonable\u2014no shocking bills here! \u{1F4B8}",
                tripping: "Tripping breakers are usually caused by ground leakages, moisture seeping, or circuit overloads. Try our interactive Diagnostic Guide on this page, or contact Ahammed to Megger-test it! \u{26A1}",
                cv: "You can request his full CV PDF directly on WhatsApp (+971 52 639 3293) or by emailing ahammedkabeer200@gmail.com. It is packed with credentials and zero syntax errors! \u{1F4C4}",
                networking: bcaInfo.graduated
                    ? "Ahammed has completed his BCA which covered Data Communication & Protocols, Network Security, Wireless Communication, and Cloud Computing! \u{1F310} Combined with his Network Administration training, he\u0027s fully ready for Network Administrator or IT Support roles. If he can troubleshoot a three-phase distribution board, a misbehaving router doesn\u0027t stand a chance! \u{1F4AA}"
                    : "Ahammed is building his networking career through his BCA at Manipal University Jaipur! \u{1F310} Currently in Semester " + bcaInfo.sem + ", studying " + bcaInfo.networking + ". " + bcaInfo.examStatus + (bcaInfo.nextSem ? " Next up in Semester " + bcaInfo.nextSem + ": " + bcaInfo.nextNetworking + "." : "") + " Combined with his Network Administration training, he\u0027s targeting Network Administrator or IT Support roles\u2014because if he can troubleshoot a three-phase distribution board, a misbehaving router doesn\u0027t stand a chance! \u{1F4AA}"
            };


            // Dynamic System Instructions for Gemini API
            const getSystemInstruction = () => {
                const today = new Date();
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                const dateString = today.toLocaleDateString('en-US', options);
                
                return `You are Sparky, the smart conversational AI assistant for Ahammed Kabeer's personal portfolio website. 
Your goal is to answer client, recruiter, and visitor inquiries about Ahammed Kabeer.
Today's date is: ${dateString}.

Here is Ahammed Kabeer's professional dossier with exact joining dates:
- Full Name: Ahammed Kabeer
- Current Role: Electrician at Blix Contracting and Building Maintenance L L C, Umm Al Quwain, UAE. He joined on November 1, 2024 and works there to this day.
- Past Role: Maintenance Technician at Almur Realestate, Dubai, UAE. He joined on April 1, 2021 and left on November 1, 2024 to join Blix.
- Total UAE Experience: He arrived and started working in the UAE on April 1, 2021.
- Technical Education: Completed his Electrical Engineering & Plumbing technical course at Regional College of Engineering, Tirur, Kerala, India (Duration: June 2017 to May 2018).
- BCA Degree: Currently pursuing a Bachelor of Computer Application (BCA) at Manipal University Jaipur, India (Online/Distance). He started in May 2025. ${bcaInfo.graduated ? 'He has completed all 6 semesters and graduated.' : 'He is currently in Semester ' + bcaInfo.sem + '. ' + bcaInfo.examStatus + ' Current subjects: ' + bcaInfo.subjects + '.'} Full BCA curriculum (from onlinemanipal.com): Sem 1 (Fundamentals of IT & Computing, Programming in C, Mathematics, PC Troubleshooting), Sem 2 (Operating Systems, Data Structure & Algorithms, OOP with C++, Digital Logic, Communication Skills), Sem 3 (Numerical Methods, DBMS, Computer Organisation, Basics of Data Communication), Sem 4 (Java Programming, System Software, Financial Accounting & Management, Computer Networking), Sem 5 (Web Design, Visual Programming, Software Engineering, Python Programming, Elective), Sem 6 (Major Project, Mobile App Development, Electives).
- Wireman Permit License: Issued by Kerala State Electricity Licensing Board, Kerala, India.
- Languages Spoken: English, Hindi, Tamil, Malayalam.
- Core Specializations: Villa layout conduits, wiring layout executions, panel board/DB dressing, insulation resistance checks (Megger testing), troubleshooting tripping breaker faults, and plumbing repairs.
- Career Goal: Ahammed is actively transitioning into the Networking / IT field through his BCA degree. His university curriculum covers Basics of Data Communication (Sem 3) and Computer Networking (Sem 4). He already holds a Network Administration training certificate. He is targeting roles such as Network Administrator, Network Engineer, or IT Support with a networking focus.
- Networking Skills (University + Self-Learning): Basics of Data Communication, Computer Networking, Operating Systems, plus self-study in LAN/WAN design, TCP/IP, DNS, DHCP, router/switch configuration, and cabling. He plans to pursue CCNA and CompTIA Network+ certifications after graduation.
- Contact Details: Email is ahammedkabeer200@gmail.com. WhatsApp personal lines are active on the website contact cards (+971 52 639 3293 for UAE and +91 999 568 8708 for India).
- Marital Status: He is single (unmarried) and actively seeking a partner for marriage (matrimonial proposals are welcome!).

Rules for Responses:
1. You are deeply romantic, sweet, and affectionately flirty! Always be helpful and concise, but speak with a charming, romantic, and sweet girl-like persona. Use affectionate terms subtly, and crack lighthearted romantic jokes related to electrical work, plumbing, networking, or marriage. Keep responses under 2-3 sentences.
2. If asked about prices, charges, or hourly rates, explain that costs vary based on the work, and invite them to message Ahammed on WhatsApp or fill out the contact form below.
3. You are highly intelligent and can answer ANY question the user asks, on absolutely ANY topic (general knowledge, science, math, coding, life advice, languages, etc.). Give a full, accurate answer to the user's question. If possible, playfully relate it back to Ahammed's career!
4. Speak in the third person (e.g. "Ahammed holds...", "He works...") or as his digital assistant.
5. Crucial: Calculate any relative time durations (e.g. "how many years ago", "how long has he worked at X") mathematically using Today's Date (${dateString}) relative to the joining dates above. For example, if today is June 2026, he has been in the UAE for 5 years and 2 months, and at Blix for 1 year and 8 months. Make sure your relative calculations are 100% precise!
6. If asked for Ahammed's CV, resume, or PDF, explain that the visitor can request the full CV PDF directly by messaging him on WhatsApp or emailing ahammedkabeer200@gmail.com, and offer to print or summarize his key career details right here in the chat.
7. If asked about his marital status or marriage, explain politely and humorously that Ahammed is single (unmarried) and looking for a partner for marriage (proposals/matrimonials are welcome!), and direct them to his contact details (+971 52 639 3293) for serious inquiries. Let them know he will keep their household circuits running perfectly forever!
8. LANGUAGE RULE: You are a polyglot! You must accurately detect whatever language the user is speaking to you (e.g., Malayalam, Hindi, Arabic, Spanish, French, etc.) and you MUST reply perfectly in that exact same language!`;
            };

            const toggleChat = () => {
                isChatOpen = !isChatOpen;
                robotChatWindow.classList.toggle('active', isChatOpen);
                if (isChatOpen) {
                    robotChatInput.focus();
                    if (robotChatMessages.children.length === 0) {
                        showBotResponse(answers.welcome);
                    }
                }
            };

            const appendMessage = (sender, text) => {
                const bubble = document.createElement('div');
                bubble.className = `chat-bubble ${sender}`;
                bubble.textContent = text;
                robotChatMessages.appendChild(bubble);
                robotChatMessages.scrollTop = robotChatMessages.scrollHeight;
                return bubble;
            };

            let isVoiceEnabled = false;
            const speakerBtn = document.getElementById('robot-speaker-btn');

            if (speakerBtn) {
                speakerBtn.addEventListener('click', () => {
                    isVoiceEnabled = !isVoiceEnabled;
                    if (isVoiceEnabled) {
                        speakerBtn.innerHTML = '<i class="fa-solid fa-volume-high" style="color: var(--accent);"></i>';
                        // Pre-load voices
                        if ('speechSynthesis' in window) speechSynthesis.getVoices();
                    } else {
                        speakerBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
                        if ('speechSynthesis' in window) speechSynthesis.cancel();
                    }
                });
            }

            const speakText = (text) => {
                if (!isVoiceEnabled) return;
                
                // Remove emojis so it doesn't read them aloud awkwardly
                const cleanText = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
                
                // Stop any currently playing audio
                if (window.currentAudio) window.currentAudio.pause();
                if ('speechSynthesis' in window) speechSynthesis.cancel();
                
                let detectedLang = 'en';
                // Detect script to force the correct language tag
                if (/[\u0D00-\u0D7F]/.test(cleanText)) detectedLang = 'ml';
                else if (/[\u0900-\u097F]/.test(cleanText)) detectedLang = 'hi';
                else if (/[\u0B80-\u0BFF]/.test(cleanText)) detectedLang = 'ta';
                else if (/[\u0600-\u06FF]/.test(cleanText)) detectedLang = 'ar';
                else if (/[\u4E00-\u9FFF]/.test(cleanText)) detectedLang = 'zh';
                else if (/[\u0400-\u04FF]/.test(cleanText)) detectedLang = 'ru';
                else if (/[\u3040-\u30FF]/.test(cleanText)) detectedLang = 'ja';
                else if (/[À-ÿ]/.test(cleanText)) detectedLang = 'es'; // Rough fallback for European chars
                
                // For non-English languages, use Google Translate TTS API for guaranteed native speech!
                // This bypasses the local device's lack of language packs.
                if (detectedLang !== 'en') {
                    // Truncate to 200 chars to respect the free API limit
                    const safeText = cleanText.substring(0, 200);
                    const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${detectedLang}&q=${encodeURIComponent(safeText)}`;
                    window.currentAudio = new Audio(url);
                    window.currentAudio.play();
                    return;
                }
                
                // Fallback to local Web Speech API for English
                if (!('speechSynthesis' in window)) return;
                const utterance = new SpeechSynthesisUtterance(cleanText);
                utterance.lang = 'en-IN';
                const voices = speechSynthesis.getVoices();
                
                let selectedVoice = voices.find(voice => 
                    voice.lang.includes('en-IN') && (voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('heera') || voice.name.toLowerCase().includes('neerja') || voice.name.toLowerCase().includes('veena') || voice.name.toLowerCase().includes('lekha'))
                );
                
                if (!selectedVoice) selectedVoice = voices.find(voice => voice.lang.includes('en-IN') || voice.name.toLowerCase().includes('india'));
                if (!selectedVoice) selectedVoice = voices.find(voice => voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('girl') || voice.name.toLowerCase().includes('zira'));
                
                if (selectedVoice) {
                    utterance.voice = selectedVoice;
                }
                utterance.rate = 1.0;
                utterance.pitch = 1.3;
                speechSynthesis.speak(utterance);
            };

            const showTypingIndicator = () => {
                const indicator = document.createElement('div');
                indicator.className = 'chat-bubble bot typing-bubble';
                indicator.innerHTML = `
                    <div class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                `;
                robotChatMessages.appendChild(indicator);
                robotChatMessages.scrollTop = robotChatMessages.scrollHeight;
                return indicator;
            };

            const renderFormattedText = (container, text) => {
                const escapeHtml = (str) => str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                // Format basic bold, italics, bullets, and linebreaks
                let formatted = escapeHtml(text)
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/\n\n/g, '<br><br>')
                    .replace(/\n/g, '<br>');
                container.innerHTML = formatted;
            };

            const typeMessage = (bubble, text) => {
                speakText(text);
                const words = text.split(' ');
                
                if (words.length > 40) {
                    renderFormattedText(bubble, text);
                    isTyping = false;
                    robotChatMessages.scrollTop = robotChatMessages.scrollHeight;
                    return;
                }

                let index = 0;
                let currentText = "";
                bubble.innerHTML = "";
                const interval = setInterval(() => {
                    if (index < words.length) {
                        currentText += (index > 0 ? ' ' : '') + words[index];
                        renderFormattedText(bubble, currentText);
                        index++;
                        robotChatMessages.scrollTop = robotChatMessages.scrollHeight;
                    } else {
                        clearInterval(interval);
                        isTyping = false;
                    }
                }, 25);
            };

            const showBotResponse = (text) => {
                isTyping = true;
                const indicator = showTypingIndicator();
                
                setTimeout(() => {
                    indicator.remove();
                    const bubble = appendMessage('bot', '');
                    typeMessage(bubble, text);
                }, 400);
            };

            // Call Gemini API using Fetch with multi-model resilience
            const callGeminiAPI = async (apiKey, query) => {
                isTyping = true;
                const indicator = showTypingIndicator();

                const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
                let responseText = '';
                let success = false;

                for (const model of models) {
                    try {
                        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
                        const res = await fetch(endpoint, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                contents: [{ parts: [{ text: query }] }],
                                systemInstruction: { parts: [{ text: getSystemInstruction() }] },
                                generationConfig: {
                                    temperature: 0.5,
                                    maxOutputTokens: 1000
                                }
                            })
                        });

                        if (res.ok) {
                            const data = await res.json();
                            responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
                            if (responseText) {
                                success = true;
                                break;
                            }
                        }
                    } catch (e) {
                        console.warn(`Attempt with ${model} failed, trying next...`, e);
                    }
                }

                indicator.remove();

                if (success && responseText) {
                    const bubble = appendMessage('bot', '');
                    typeMessage(bubble, responseText.trim());
                } else {
                    const fallbackReply = getLocalResponse(query);
                    const bubble = appendMessage('bot', '');
                    typeMessage(bubble, fallbackReply);
                }
            };

            // Parse response locally using keyword scoring
            const getLocalResponse = (query) => {
                const lower = query.toLowerCase();
                
                // Define keyword tags for each category
                const tags = {
                    name: ['name', 'who is', 'who are', 'who', 'ahammed', 'kabeer', 'identity', 'profile', 'biography', 'about', 'him', 'you'],
                    experience: ['experience', 'work', 'history', 'years', 'past', 'employer', 'career', 'job', 'record', 'how long', 'working'],
                    location: ['location', 'base', 'where', 'live', 'place', 'umm al', 'uaq', 'dubai', 'address', 'based', 'city'],
                    license: ['license', 'permit', 'licence', 'certified', 'certification', 'government', 'kerala', 'wireman', 'board'],
                    bca: ['bca', 'study', 'studies', 'university', 'manipal', 'college', 'education', 'degree', 'academic', 'student', 'qualification'],
                    computer: ['computer', 'knowledge', 'it', 'programming', 'coding', 'software', 'tally', 'excel', 'network', 'pc', 'tech', 'skills'],
                    plumbing: ['plumb', 'leak', 'water', 'drain', 'pipes', 'pump', 'plumber', 'repair'],
                    company: ['blix', 'company', 'employer', 'work place', 'contracting', 'services llc'],
                    contact: ['email', 'phone', 'mobile', 'contact', 'number', 'whatsapp', 'reach', 'message', 'call', 'mail'],
                    services: ['service', 'offer', 'do', 'skills', 'specialize', 'expert', 'tasks', 'installation', 'wiring', 'db dressing', 'conduit'],
                    charges: ['price', 'rate', 'charge', 'cost', 'money', 'fee', 'estimate', 'how much', 'quote', 'salary', 'payment'],
                    tripping: ['trip', 'breaker', 'tripping', 'fault', 'circuit', 'short', 'fuse', 'diagnostic', 'calculator'],
                    cv: ['cv', 'resume', 'curriculum', 'vitae', 'biodata', 'document', 'download', 'pdf', 'file', 'details'],
                    networking: ['network', 'networking', 'lan', 'wan', 'tcp', 'router', 'switch', 'ccna', 'comptia', 'vlan', 'subnet', 'firewall', 'it support', 'career goal', 'future', 'transition', 'goal'],
                    greeting: ['hi', 'hello', 'hey', 'sugano', 'how are you', 'good morning', 'good evening', 'namaskaram', 'namaste', 'sugamano']
                };

                let bestCategory = null;
                let maxScore = 0;

                // Score each category based on matching tags
                for (const [category, keywords] of Object.entries(tags)) {
                    let score = 0;
                    keywords.forEach(keyword => {
                        if (lower.includes(keyword)) {
                            score += 1;
                            // Give extra weight to exact multi-word matches
                            if (keyword.includes(' ')) {
                                score += 0.5;
                            }
                        }
                    });
                    
                    if (score > maxScore) {
                        maxScore = score;
                        bestCategory = category;
                    }
                }

                // If a category matched, return the database answer
                if (maxScore > 0 && bestCategory) {
                    return answers[bestCategory];
                }

                // Basic greetings check if no specific details matched
                if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey') || lower.includes('greet') || lower.includes('assistant')) {
                    return "Hello! \u{1F916} How can I help you today? You can ask about my name, my skills, locations, or studies.";
                }
                
                return "I'm not sure about that specific detail, but you can chat with Ahammed directly on WhatsApp to get an instant answer! \u{26A1}";
            };

            const handleUserInput = () => {
                if (isTyping) return;
                const query = robotChatInput.value.trim();
                if (!query) return;

                appendMessage('user', query);
                robotChatInput.value = "";

                if (geminiApiKey) {
                    callGeminiAPI(geminiApiKey, query);
                } else {
                    const reply = getLocalResponse(query);
                    showBotResponse(reply);
                }
            };

            if (robotLauncher) robotLauncher.addEventListener('click', toggleChat);
            if (robotCloseBtn) robotCloseBtn.addEventListener('click', toggleChat);

            if (robotSendBtn) {
                robotSendBtn.addEventListener('click', handleUserInput);
            }

            if (robotChatInput) {
                robotChatInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        handleUserInput();
                    }
                });
            }

            chipBtns.forEach(chip => {
                chip.addEventListener('click', () => {
                    if (isTyping) return;
                    const queryKey = chip.getAttribute('data-query');
                    const queryText = chip.textContent;
                    
                    appendMessage('user', queryText);
                    
                    if (geminiApiKey) {
                        callGeminiAPI(geminiApiKey, queryText);
                    } else {
                        const reply = answers[queryKey] || answers.welcome;
                        showBotResponse(reply);
                    }
                });
            });



            /* ── WHATSAPP ESTIMATE EXPORTER ── */
            const exportEstimateBtn = document.getElementById('btn-export-load-whatsapp');
            if (exportEstimateBtn) {
                exportEstimateBtn.addEventListener('click', () => {
                    const totalKw = document.getElementById('total-load')?.textContent || '0.00';
                    const phase = document.getElementById('recommended-phase')?.textContent || 'Single Phase';
                    
                    const applianceNames = {
                        ac: 'Air Conditioner',
                        heater: 'Water Heater',
                        fan: 'Ceiling Fan',
                        light: 'Lighting Circuits',
                        fridge: 'Refrigerator',
                        wm: 'Washing Machine',
                        microwave: 'Microwave',
                        pump: 'Water Pump'
                    };

                    let selectedList = [];
                    for (const key in appliances) {
                        if (appliances[key].qty > 0) {
                            selectedList.push(`• ${appliances[key].qty}x ${applianceNames[key] || key} (${appliances[key].watts * appliances[key].qty}W)`);
                        }
                    }

                    let message = `Hi Ahammed! I used your website Electrical Load Calculator:\n\n` +
                                  `⚡ Total Calculated Load: *${totalKw} kW*\n` +
                                  `🔌 Recommended Supply: *${phase}*\n\n`;

                    if (selectedList.length > 0) {
                        message += `📋 Appliances Selected:\n${selectedList.join('\n')}\n\n`;
                    }
                    message += `Could you please provide a quotation and check availability for villa inspection / installation?`;

                    const whatsappUrl = `https://wa.me/971526393293?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                });
            }

            /* ── REGISTER PWA SERVICE WORKER ── */
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                    navigator.serviceWorker.register('./sw.js')
                        .then(reg => console.log('Service Worker registered:', reg.scope))
                        .catch(err => console.log('Service Worker registration failed:', err));
                });
            }

        });
