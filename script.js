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


            /* ── TOOLS HUB TAB SWITCHER ── */
            const toolTabBtns = document.querySelectorAll('.tool-tab-btn');
            const toolPanels = document.querySelectorAll('.tool-panel');

            toolTabBtns.forEach(tabBtn => {
                tabBtn.addEventListener('click', () => {
                    const targetTabId = tabBtn.getAttribute('data-tab');
                    if (!targetTabId) return;

                    toolTabBtns.forEach(b => {
                        b.classList.remove('active');
                        b.setAttribute('aria-selected', 'false');
                    });
                    toolPanels.forEach(p => p.classList.remove('active'));

                    tabBtn.classList.add('active');
                    tabBtn.setAttribute('aria-selected', 'true');
                    const activePanel = document.getElementById(targetTabId);
                    if (activePanel) {
                        activePanel.classList.add('active');
                    }
                });
            });

            /* ── TAB 1: ELECTRICAL LOAD ESTIMATOR ── */
            const appliances = {
                ac: { watts: 3000, qty: 0 },
                heater: { watts: 1500, qty: 0 },
                fan: { watts: 75, qty: 0 },
                light: { watts: 50, qty: 0 },
                fridge: { watts: 400, qty: 0 },
                wm: { watts: 1000, qty: 0 },
                microwave: { watts: 1200, qty: 0 },
                pump: { watts: 750, qty: 0 },
                oven: { watts: 3500, qty: 0 },
                washer: { watts: 2000, qty: 0 },
                ev: { watts: 7400, qty: 0 }
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
                if (totalLoadEl) totalLoadEl.textContent = kw;

                // Phase recommendation
                let phase = "Single Phase (220V)";
                let verdict = "Your total electrical load is within standard residential limits. <strong>Standard maintenance and checkups</strong> are recommended annually to ensure contact tightness and avoid insulation failures.";
                
                if (totalWatts > 10000) {
                    phase = "Three Phase (400V)";
                    verdict = "High load detected (" + kw + " kW)! It is highly recommended to use a <strong>Three-Phase Distribution Board</strong> to balance the load evenly across all three phases (R, Y, B) to prevent neutral wire overheating and main incomer tripping.";
                } else if (totalWatts === 0) {
                    phase = "—";
                    verdict = "Select household appliances above to calculate your estimated electrical load and receive a custom recommendation.";
                }

                if (recommendedPhaseEl) recommendedPhaseEl.textContent = phase;
                if (verdictBoxEl) verdictBoxEl.innerHTML = verdict;
            };

            // Plus/Minus Button Event Listeners
            document.querySelectorAll('.qty-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const key = button.getAttribute('data-appliance');
                    const action = button.getAttribute('data-action');
                    const qtyValEl = document.getElementById(`qty-${key}`);

                    if (!appliances[key]) return;

                    if (action === 'plus') {
                        appliances[key].qty++;
                    } else if (action === 'minus' && appliances[key].qty > 0) {
                        appliances[key].qty--;
                    }

                    if (qtyValEl) qtyValEl.value = appliances[key].qty;
                    updateCalculator();
                });
            });

            // Direct Keyboard Input Listeners
            document.querySelectorAll('.qty-val').forEach(input => {
                input.addEventListener('input', () => {
                    const key = input.id.replace('qty-', '');
                    if (!appliances[key]) return;
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
                        if (appliances[key]) appliances[key].qty = 0;
                        updateCalculator();
                    }
                });
            });

            // Tab 1 WhatsApp Export
            const btnExportLoadWhatsApp = document.getElementById('btn-export-load-whatsapp');
            if (btnExportLoadWhatsApp) {
                btnExportLoadWhatsApp.addEventListener('click', () => {
                    const kw = totalLoadEl ? totalLoadEl.textContent : '0';
                    const phase = recommendedPhaseEl ? recommendedPhaseEl.textContent : 'Single Phase';
                    let loadItems = [];
                    for (const k in appliances) {
                        if (appliances[k].qty > 0) {
                            loadItems.push(`${k.toUpperCase()}: ${appliances[k].qty} unit(s)`);
                        }
                    }
                    const summary = loadItems.length > 0 ? loadItems.join(', ') : 'No items selected';
                    const text = `Hi Ahammed, I used your Villa Load Calculator on your website:\n\n⚡ *Total Estimated Load:* ${kw} kW\n🔌 *Recommended Supply:* ${phase}\n📋 *Appliance Breakdown:* ${summary}\n\nCould you please advise on 3-Phase DB dressing / load balancing and quotation for my villa?`;
                    window.open(`https://wa.me/${atob("OTcxNTI2MzkzMjkz")}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
                });
            }

            // Initialize Load Calculator
            updateCalculator();


            /* ── TAB 2: DEWA / FEWA / SEWA BILL & AC COST ESTIMATOR ── */
            let isDewaInverter = false;
            const dewaUtility = document.getElementById('dewa-utility');
            const dewaAcCount = document.getElementById('dewa-ac-count');
            const dewaAcCountBadge = document.getElementById('dewa-ac-count-badge');
            const dewaAcTon = document.getElementById('dewa-ac-ton');
            const dewaAcHours = document.getElementById('dewa-ac-hours');
            const dewaAcHoursBadge = document.getElementById('dewa-ac-hours-badge');
            const dewaBaseLoad = document.getElementById('dewa-base-load');
            const dewaBaseLoadBadge = document.getElementById('dewa-base-load-badge');
            const dewaPillBtns = document.querySelectorAll('[data-inverter]');

            const dewaResCost = document.getElementById('dewa-res-cost');
            const dewaResDaily = document.getElementById('dewa-res-daily');
            const dewaResKwh = document.getElementById('dewa-res-kwh');
            const dewaResAcKwh = document.getElementById('dewa-res-ac-kwh');
            const dewaResAcPct = document.getElementById('dewa-res-ac-pct');
            const dewaResSlabCost = document.getElementById('dewa-res-slab-cost');
            const dewaResFsc = document.getElementById('dewa-res-fsc');
            const dewaResVat = document.getElementById('dewa-res-vat');
            const dewaResVerdict = document.getElementById('dewa-res-verdict');

            dewaPillBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    dewaPillBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    isDewaInverter = btn.getAttribute('data-inverter') === 'yes';
                    updateDewaFewaCalc();
                });
            });

            const updateDewaFewaCalc = () => {
                if (!dewaUtility || !dewaAcCount || !dewaAcTon || !dewaAcHours || !dewaBaseLoad) return;

                const utility = dewaUtility.value;
                const acCount = parseInt(dewaAcCount.value, 10) || 1;
                const acTon = parseFloat(dewaAcTon.value) || 2.0;
                const acHours = parseInt(dewaAcHours.value, 10) || 12;
                const baseLoad = parseInt(dewaBaseLoad.value, 10) || 600;

                if (dewaAcCountBadge) dewaAcCountBadge.textContent = `${acCount} Unit${acCount > 1 ? 's' : ''}`;
                if (dewaAcHoursBadge) dewaAcHoursBadge.textContent = `${acHours} Hours / Day`;
                if (dewaBaseLoadBadge) dewaBaseLoadBadge.textContent = `${baseLoad} kWh`;

                // Calculate AC kW draw (approx 1.2 kW per ton standard, 30% reduction if inverter)
                let kwPerAc = acTon * 1.2;
                if (isDewaInverter) kwPerAc *= 0.70;

                // Monthly kWh for AC (duty cycle ~0.80 due to thermostat cycling)
                const monthlyAcKwh = Math.round(acCount * kwPerAc * acHours * 0.80 * 30);
                const totalKwh = monthlyAcKwh + baseLoad;
                const acPct = totalKwh > 0 ? Math.round((monthlyAcKwh / totalKwh) * 100) : 0;

                // Slab Tariff Calculation
                let slabCost = 0;
                let fscRate = 0.055; // default 5.5 fils

                if (utility === 'dewa') {
                    // DEWA Residential Slabs (Expat / General)
                    fscRate = 0.055;
                    let rem = totalKwh;
                    if (rem > 0) {
                        const s1 = Math.min(rem, 2000);
                        slabCost += s1 * 0.23;
                        rem -= s1;
                    }
                    if (rem > 0) {
                        const s2 = Math.min(rem, 2000);
                        slabCost += s2 * 0.28;
                        rem -= s2;
                    }
                    if (rem > 0) {
                        const s3 = Math.min(rem, 2000);
                        slabCost += s3 * 0.32;
                        rem -= s3;
                    }
                    if (rem > 0) {
                        slabCost += rem * 0.38;
                    }
                } else if (utility === 'fewa') {
                    // FEWA / Etihad WE Residential Slabs
                    fscRate = 0.050;
                    let rem = totalKwh;
                    if (rem > 0) {
                        const s1 = Math.min(rem, 2000);
                        slabCost += s1 * 0.28;
                        rem -= s1;
                    }
                    if (rem > 0) {
                        const s2 = Math.min(rem, 2000);
                        slabCost += s2 * 0.33;
                        rem -= s2;
                    }
                    if (rem > 0) {
                        const s3 = Math.min(rem, 2000);
                        slabCost += s3 * 0.37;
                        rem -= s3;
                    }
                    if (rem > 0) {
                        slabCost += rem * 0.43;
                    }
                } else {
                    // SEWA Slabs
                    fscRate = 0.045;
                    let rem = totalKwh;
                    if (rem > 0) {
                        const s1 = Math.min(rem, 2000);
                        slabCost += s1 * 0.25;
                        rem -= s1;
                    }
                    if (rem > 0) {
                        const s2 = Math.min(rem, 4000);
                        slabCost += s2 * 0.30;
                        rem -= s2;
                    }
                    if (rem > 0) {
                        slabCost += rem * 0.38;
                    }
                }

                const fscCost = totalKwh * fscRate;
                const subtotal = slabCost + fscCost;
                const vatCost = subtotal * 0.05; // 5% VAT
                const totalCost = Math.round(subtotal + vatCost);
                const dailyCost = (totalCost / 30).toFixed(1);

                if (dewaResCost) dewaResCost.textContent = totalCost.toLocaleString();
                if (dewaResDaily) dewaResDaily.textContent = dailyCost;
                if (dewaResKwh) dewaResKwh.textContent = `${totalKwh.toLocaleString()} kWh`;
                if (dewaResAcKwh) dewaResAcKwh.textContent = `${monthlyAcKwh.toLocaleString()} kWh`;
                if (dewaResAcPct) dewaResAcPct.textContent = `${acPct}%`;
                if (dewaResSlabCost) dewaResSlabCost.textContent = `${slabCost.toFixed(2)} AED`;
                if (dewaResFsc) dewaResFsc.textContent = `${fscCost.toFixed(2)} AED`;
                if (dewaResVat) dewaResVat.textContent = `${vatCost.toFixed(2)} AED`;

                // Technical Verdict
                let verdict = "";
                if (acPct >= 70) {
                    verdict = `❄️ <strong>AC heavy load:</strong> AC units account for <strong>${acPct}%</strong> of your monthly bill. Recommended actions: Clean evaporator/condenser coils monthly, install smart digital thermostats at 24°C, and ensure dedicated isolator circuits to cut up to 25% energy waste.`;
                } else if (totalKwh > 6000) {
                    verdict = `⚠️ <strong>Red Slab Alert:</strong> Your consumption reaches Slab 4 (highest tariff rate). Upgrading regular compressors to Inverter units and balancing DB phases will lower your overall power tier.`;
                } else {
                    verdict = `✅ <strong>Balanced Consumption:</strong> Your electricity consumption stays within standard mid-tier slabs. Routine coil cleaning and preventative DB checkups will maintain peak energy efficiency.`;
                }
                if (dewaResVerdict) dewaResVerdict.innerHTML = verdict;
            };

            // Event Listeners for Tab 2
            if (dewaUtility) dewaUtility.addEventListener('change', updateDewaFewaCalc);
            if (dewaAcCount) dewaAcCount.addEventListener('input', updateDewaFewaCalc);
            if (dewaAcTon) dewaAcTon.addEventListener('change', updateDewaFewaCalc);
            if (dewaAcHours) dewaAcHours.addEventListener('input', updateDewaFewaCalc);
            if (dewaBaseLoad) dewaBaseLoad.addEventListener('input', updateDewaFewaCalc);

            // Tab 2 WhatsApp Export
            const btnExportDewaWhatsApp = document.getElementById('btn-export-dewa-whatsapp');
            if (btnExportDewaWhatsApp) {
                btnExportDewaWhatsApp.addEventListener('click', () => {
                    const cost = dewaResCost ? dewaResCost.textContent : '0';
                    const kwh = dewaResKwh ? dewaResKwh.textContent : '0';
                    const acPct = dewaResAcPct ? dewaResAcPct.textContent : '0%';
                    const util = dewaUtility ? dewaUtility.options[dewaUtility.selectedIndex].text : 'DEWA/FEWA';
                    const text = `Hi Ahammed, I calculated my estimated monthly electricity bill on your website:\n\n⚡ *Provider:* ${util}\n💰 *Estimated Monthly Cost:* ${cost} AED\n📊 *Monthly Consumption:* ${kwh}\n❄️ *AC Power Share:* ${acPct}\n\nCan I consult you for an electrical inspection and AC energy-saving tune-up at my property?`;
                    window.open(`https://wa.me/${atob("OTcxNTI2MzkzMjkz")}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
                });
            }

            // Initialize Tab 2
            updateDewaFewaCalc();


            /* ── TAB 4: UAE CABLE SIZING & VOLTAGE DROP CALCULATOR ── */
            let cablePhase = 1; // 1 = Single Phase (230V), 3 = Three Phase (400V)
            const cablePillBtns = document.querySelectorAll('[data-phase-type]');
            const cableLoad = document.getElementById('cable-load');
            const cableLoadBadge = document.getElementById('cable-load-badge');
            const cableLength = document.getElementById('cable-length');
            const cableLengthBadge = document.getElementById('cable-length-badge');
            const cableInsulation = document.getElementById('cable-insulation');
            const cableAmbient = document.getElementById('cable-ambient');

            const cableResSize = document.getElementById('cable-res-size');
            const cableResCapacity = document.getElementById('cable-res-capacity');
            const cableResVdVolts = document.getElementById('cable-res-vd-volts');
            const cableResVdPct = document.getElementById('cable-res-vd-pct');
            const cableMeterFill = document.getElementById('cable-meter-fill');
            const cableResCurrent = document.getElementById('cable-res-current');
            const cableResMcb = document.getElementById('cable-res-mcb');
            const cableResMaxLen = document.getElementById('cable-res-max-len');
            const cableResVerdict = document.getElementById('cable-res-verdict');

            // Standard Copper Cable Data (BS 7671 / DEWA)
            const cableTable = [
                { size: 1.5,  xlpe: 23,  pvc: 17.5, mvSingle: 29.0,  mvThree: 25.0,  mcb: "10A Type B/C" },
                { size: 2.5,  xlpe: 31,  pvc: 24,   mvSingle: 18.0,  mvThree: 15.0,  mcb: "16A or 20A Type C" },
                { size: 4.0,  xlpe: 42,  pvc: 32,   mvSingle: 11.0,  mvThree: 9.5,   mcb: "25A or 32A Type C" },
                { size: 6.0,  xlpe: 54,  pvc: 41,   mvSingle: 7.3,   mvThree: 6.4,   mcb: "40A Type C" },
                { size: 10.0, xlpe: 75,  pvc: 57,   mvSingle: 4.4,   mvThree: 3.8,   mcb: "50A or 63A Type C" },
                { size: 16.0, xlpe: 100, pvc: 76,   mvSingle: 2.8,   mvThree: 2.4,   mcb: "80A Type C" },
                { size: 25.0, xlpe: 135, pvc: 101,  mvSingle: 1.75,  mvThree: 1.5,   mcb: "100A MCCB" },
                { size: 35.0, xlpe: 169, pvc: 125,  mvSingle: 1.25,  mvThree: 1.1,   mcb: "125A MCCB" },
                { size: 50.0, xlpe: 207, pvc: 151,  mvSingle: 0.93,  mvThree: 0.81,  mcb: "160A MCCB" }
            ];

            cablePillBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    cablePillBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    cablePhase = parseInt(btn.getAttribute('data-phase-type'), 10) || 1;
                    updateCableCalc();
                });
            });

            const updateCableCalc = () => {
                if (!cableLoad || !cableLength || !cableInsulation || !cableAmbient) return;

                const kw = parseFloat(cableLoad.value) || 7.5;
                const length = parseFloat(cableLength.value) || 30;
                const insulation = cableInsulation.value; // 'xlpe' or 'pvc'
                const ambient = parseInt(cableAmbient.value, 10) || 50;

                // Ambient Temperature Derating Factor (Ca)
                let ca = 0.82;
                if (ambient === 50) {
                    ca = insulation === 'xlpe' ? 0.82 : 0.71;
                } else {
                    ca = insulation === 'xlpe' ? 0.91 : 0.87;
                }

                // Calculate Full Load Current
                let Ib = 0;
                let voltage = 230;
                const pf = 0.88;

                if (cablePhase === 1) {
                    voltage = 230;
                    Ib = (kw * 1000) / (voltage * pf);
                } else {
                    voltage = 400;
                    Ib = (kw * 1000) / (Math.sqrt(3) * voltage * pf);
                }

                if (cableLoadBadge) {
                    cableLoadBadge.textContent = `${kw.toFixed(1)} kW (~${Ib.toFixed(1)} A)`;
                }
                if (cableLengthBadge) {
                    cableLengthBadge.textContent = `${Math.round(length)} Meters`;
                }

                const requiredIz = Ib / ca;

                // Find candidate cable that meets both thermal rating and voltage drop <= 4.0%
                let chosenCable = null;
                let calculatedVdVolts = 0;
                let calculatedVdPct = 0;

                for (let i = 0; i < cableTable.length; i++) {
                    const row = cableTable[i];
                    const baseCapacity = insulation === 'xlpe' ? row.xlpe : row.pvc;
                    const deratedCapacity = baseCapacity * ca;

                    if (baseCapacity >= requiredIz) {
                        const mvRate = cablePhase === 1 ? row.mvSingle : row.mvThree;
                        const vdVolts = (mvRate * Ib * length) / 1000;
                        const vdParmPct = (vdVolts / voltage) * 100;

                        if (vdParmPct <= 4.0 || i === cableTable.length - 1) {
                            chosenCable = row;
                            calculatedVdVolts = vdVolts;
                            calculatedVdPct = vdParmPct;
                            break;
                        }
                    }
                }

                if (!chosenCable) {
                    chosenCable = cableTable[cableTable.length - 1];
                    const mvRate = cablePhase === 1 ? chosenCable.mvSingle : chosenCable.mvThree;
                    calculatedVdVolts = (mvRate * Ib * length) / 1000;
                    calculatedVdPct = (calculatedVdVolts / voltage) * 100;
                }

                const baseCap = insulation === 'xlpe' ? chosenCable.xlpe : chosenCable.pvc;
                const deratedCap = baseCap * ca;

                // Calculate max length before exceeding 4% drop
                const mvRate = cablePhase === 1 ? chosenCable.mvSingle : chosenCable.mvThree;
                const maxPermissibleVd = voltage * 0.04;
                const maxRun = Ib > 0 && mvRate > 0 ? Math.round((maxPermissibleVd * 1000) / (mvRate * Ib)) : 100;

                // Update UI elements
                if (cableResSize) cableResSize.textContent = chosenCable.size.toFixed(1);
                if (cableResCapacity) cableResCapacity.textContent = `${deratedCap.toFixed(1)} A`;
                if (cableResCurrent) cableResCurrent.textContent = `${Ib.toFixed(1)} A`;
                if (cableResVdVolts) cableResVdVolts.textContent = calculatedVdVolts.toFixed(1);
                if (cableResVdPct) cableResVdPct.textContent = `${calculatedVdPct.toFixed(2)}%`;
                if (cableResMcb) cableResMcb.textContent = chosenCable.mcb;
                if (cableResMaxLen) cableResMaxLen.textContent = `${maxRun} Meters`;

                // Voltage Drop Meter Bar
                if (cableMeterFill) {
                    const meterWidth = Math.min(Math.max((calculatedVdPct / 5.0) * 100, 5), 100);
                    cableMeterFill.style.width = `${meterWidth}%`;
                    if (calculatedVdPct <= 2.5) {
                        cableMeterFill.style.background = 'linear-gradient(90deg, #10b981, #059669)';
                    } else if (calculatedVdPct <= 4.0) {
                        cableMeterFill.style.background = 'linear-gradient(90deg, #f59e0b, #d97706)';
                    } else {
                        cableMeterFill.style.background = 'linear-gradient(90deg, #ef4444, #b91c1c)';
                    }
                }

                // Technical Verdict
                let verdict = "";
                if (calculatedVdPct <= 2.5) {
                    verdict = `✅ <strong>Optimal DEWA Compliance:</strong> The selected <strong>${chosenCable.size} mm²</strong> cable provides superior conductivity with a minimal ${calculatedVdPct.toFixed(2)}% voltage drop at 50°C ambient, preventing equipment overheating.`;
                } else if (calculatedVdPct <= 4.0) {
                    verdict = `⚠️ <strong>Acceptable Range (Marginal):</strong> Voltage drop is ${calculatedVdPct.toFixed(2)}% (DEWA/FEWA ceiling is 4.0%). If future loads or additional AC compressors might be added, consider upsizing one step.`;
                } else {
                    verdict = `🚨 <strong>NON-COMPLIANT DROP (${calculatedVdPct.toFixed(2)}%):</strong> Voltage drop exceeds the 4.0% DEWA/FEWA safety threshold! Upsize the cable conductor immediately to avoid motor burnouts and tripping.`;
                }
                if (cableResVerdict) cableResVerdict.innerHTML = verdict;
            };

            // Event listeners for Tab 4
            if (cableLoad) cableLoad.addEventListener('input', updateCableCalc);
            if (cableLength) cableLength.addEventListener('input', updateCableCalc);
            if (cableInsulation) cableInsulation.addEventListener('change', updateCableCalc);
            if (cableAmbient) cableAmbient.addEventListener('change', updateCableCalc);

            // Tab 4 WhatsApp Export
            const btnExportCableWhatsApp = document.getElementById('btn-export-cable-whatsapp');
            if (btnExportCableWhatsApp) {
                btnExportCableWhatsApp.addEventListener('click', () => {
                    const size = cableResSize ? cableResSize.textContent : '6.0';
                    const kw = cableLoad ? cableLoad.value : '7.5';
                    const len = cableLength ? cableLength.value : '30';
                    const vd = cableResVdPct ? cableResVdPct.textContent : '2.0%';
                    const phaseStr = cablePhase === 1 ? 'Single Phase (230V)' : 'Three Phase (400V)';
                    const text = `Hi Ahammed, I used your UAE Cable Sizing & Voltage Drop Calculator:\n\n⚡ *Load:* ${kw} kW (${phaseStr})\n📏 *Distance:* ${len} Meters\n🔬 *Recommended Cable:* ${size} mm² Cu\n📉 *Calculated Voltage Drop:* ${vd}\n\nCould you assist with procurement, circuit pull-in, and professional DB dressing?`;
                    window.open(`https://wa.me/${atob("OTcxNTI2MzkzMjkz")}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
                });
            }

            // Initialize Tab 4
            updateCableCalc();


            /* ── TAB 5: WATER BOOSTER PUMP & PRESSURE TANK CALIBRATION ── */
            const pumpFloors = document.getElementById('pump-floors');
            const pumpBaths = document.getElementById('pump-baths');
            const pumpBathsBadge = document.getElementById('pump-baths-badge');
            const pumpHp = document.getElementById('pump-hp');
            const pumpTankSize = document.getElementById('pump-tank-size');

            const pumpResCutin = document.getElementById('pump-res-cutin');
            const pumpResCutinPsi = document.getElementById('pump-res-cutin-psi');
            const pumpResCutout = document.getElementById('pump-res-cutout');
            const pumpResCutoutPsi = document.getElementById('pump-res-cutout-psi');
            const pumpResPrecharge = document.getElementById('pump-res-precharge');
            const pumpResVerdict = document.getElementById('pump-res-verdict');

            const updatePumpCalc = () => {
                if (!pumpFloors || !pumpBaths || !pumpHp || !pumpTankSize) return;

                const floors = parseInt(pumpFloors.value, 10) || 2;
                const baths = parseInt(pumpBaths.value, 10) || 4;
                const hp = parseFloat(pumpHp.value) || 0.75;
                const tankSize = parseInt(pumpTankSize.value, 10) || 24;

                if (pumpBathsBadge) pumpBathsBadge.textContent = `${baths} Bathroom${baths > 1 ? 's' : ''}`;

                // Static Head Elevation:
                // Floor 1 (G): ~3m (0.3 bar), Floor 2 (G+1): ~6m (0.6 bar), Floor 3 (G+2): ~9m (0.9 bar)
                const elevationHeadBar = floors * 0.3;

                // Required residual pressure at the highest shower: minimum 1.5 - 1.8 bar
                let baseResidual = 1.6;
                if (baths >= 6) baseResidual = 1.8;

                // Recommended Cut-In (Start Pressure)
                let cutIn = parseFloat((elevationHeadBar + baseResidual).toFixed(1));
                if (cutIn < 1.8) cutIn = 1.8;
                if (cutIn > 2.8) cutIn = 2.8;

                // Recommended Cut-Out (Stop Pressure): Typically Cut-In + 1.2 to 1.5 bar differential
                let cutOut = parseFloat((cutIn + 1.4).toFixed(1));
                if (hp >= 1.0) cutOut = parseFloat((cutIn + 1.6).toFixed(1));

                // Mandatory Air Pre-Charge Pressure for Expansion Tank
                const precharge = parseFloat((cutIn - 0.2).toFixed(1));

                const cutInPsi = Math.round(cutIn * 14.5038);
                const cutOutPsi = Math.round(cutOut * 14.5038);
                const prechargePsi = Math.round(precharge * 14.5038);

                if (pumpResCutin) pumpResCutin.textContent = cutIn.toFixed(1);
                if (pumpResCutinPsi) pumpResCutinPsi.textContent = `(${cutInPsi} PSI)`;
                if (pumpResCutout) pumpResCutout.textContent = cutOut.toFixed(1);
                if (pumpResCutoutPsi) pumpResCutoutPsi.textContent = `(${cutOutPsi} PSI)`;
                if (pumpResPrecharge) pumpResPrecharge.textContent = precharge.toFixed(1);

                // Anti-hunting diagnostic verdict
                let verdict = "";
                if (tankSize === 24 && baths > 5) {
                    verdict = `⚠️ <strong>Tank Size Advisory:</strong> With ${baths} bathrooms, a 24L tank may cause frequent pump short-cycling during peak shower hours. Upgrading to a 50L pressure vessel will extend pump motor lifespan. Pre-charge air MUST be calibrated to <strong>${precharge} bar (${prechargePsi} PSI)</strong>.`;
                } else {
                    verdict = `✅ <strong>Optimal Calibration:</strong> Set your pressure switch cut-in to <strong>${cutIn} bar</strong>, cut-out to <strong>${cutOut} bar</strong>, and pre-charge the empty bladder tank to <strong>${precharge} bar (${prechargePsi} PSI)</strong>. This guarantees constant water flow with zero pump hunting.`;
                }
                if (pumpResVerdict) pumpResVerdict.innerHTML = verdict;
            };

            // Event Listeners for Tab 5
            if (pumpFloors) pumpFloors.addEventListener('change', updatePumpCalc);
            if (pumpBaths) pumpBaths.addEventListener('input', updatePumpCalc);
            if (pumpHp) pumpHp.addEventListener('change', updatePumpCalc);
            if (pumpTankSize) pumpTankSize.addEventListener('change', updatePumpCalc);

            // Tab 5 WhatsApp Export
            const btnExportPumpWhatsApp = document.getElementById('btn-export-pump-whatsapp');
            if (btnExportPumpWhatsApp) {
                btnExportPumpWhatsApp.addEventListener('click', () => {
                    const cutin = pumpResCutin ? pumpResCutin.textContent : '2.0';
                    const cutout = pumpResCutout ? pumpResCutout.textContent : '3.5';
                    const precharge = pumpResPrecharge ? pumpResPrecharge.textContent : '1.8';
                    const hp = pumpHp ? pumpHp.options[pumpHp.selectedIndex].text : '0.75 HP';
                    const text = `Hi Ahammed, I checked my water booster pump settings with your calculator:\n\n🚰 *Pump:* ${hp}\n🎯 *Recommended Cut-In:* ${cutin} bar\n🛑 *Recommended Cut-Out:* ${cutout} bar\n💨 *Tank Air Pre-charge:* ${precharge} bar\n\nMy pump is experiencing pressure fluctuation / cycling. Could you come inspect and calibrate the pressure switch and expansion vessel?`;
                    window.open(`https://wa.me/${atob("OTcxNTI2MzkzMjkz")}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
                });
            }

            // Initialize Tab 5
            updatePumpCalc();


            /* ── DYNAMIC WHATSAPP LINK PRE-FILL ── */
            const uaeWhatsAppBase = "https://wa.me/" + atob("OTcxNTI2MzkzMjkz");
            
            // Quick helper to format text and update links if necessary
            const getPreFilledWhatsAppLink = (message) => {
                return `${uaeWhatsAppBase}?text=${encodeURIComponent(message)}`;
            };

            const whatsappMessages = {
                'tripping': "Hi Ahammed, my circuit breaker (ELCB/RCCB) is frequently tripping at my villa and I need an urgent fault diagnosis / Megger test.",
                'overload': "Hi Ahammed, I am experiencing frequent electrical tripping due to circuit overloading and would like to inquire about dedicated circuit installation or phase balancing.",
                'neutral': "🚨 URGENT: Hi Ahammed, my lights are flickering across multiple circuits and I suspect a dangerous loose neutral in my main DB. Please assist!",
                'emergency': "🚨 EMERGENCY: Hi Ahammed, I noticed an urgent electrical hazard (burning smell / sparking wires) at my property and need an immediate callout.",
                'outlet': "Hi Ahammed, I have damaged or dead wall sockets / outlets that need testing and safe replacement at my property.",
                'circuit-dead': "Hi Ahammed, a sub-circuit / group of outlets went dead in my property. I need troubleshooting and line tracing assistance.",
                'heater': "Hi Ahammed, my water heater stopped heating / keeps tripping the breaker. Could you inspect and repair the heating element or thermostat?",
                'spd': "Hi Ahammed, I would like to inquire about installing a whole-house Surge Protection Device (SPD) in my villa distribution board.",
                'inspection': "Hi Ahammed, I would like to schedule a comprehensive residential electrical safety inspection and earth pit resistance test.",
                'switch': "Hi Ahammed, I have an electrical switch that is arcing / sparking and needs inspection and replacement.",
                'db-dressing': "Hi Ahammed, I would like to get a quotation for 3-Phase Distribution Board (DB) dressing, ferrule tagging, and load balancing.",
                'ac-wiring': "Hi Ahammed, I need electrical wiring, cable sizing, and isolator installation for an air conditioning (AC) unit.",
                'pump': "Hi Ahammed, my water booster pump has an issue (pressure switch / continuous cycling) and needs service.",
                'villa': "Hi Ahammed, I am looking for an experienced electrician for a villa construction / renovation wiring project.",
                'maintenance': "Hi Ahammed, I need routine building electrical maintenance and repair services.",
                'general': "Hi Ahammed, I visited your portfolio website and would like to inquire about your electrical and maintenance services."
            };

            // Update main hire/contact links with pre-filled text
            const contactLinks = document.querySelectorAll('.whatsapp-dynamic');
            contactLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    const serviceType = link.getAttribute('data-service') || 'general';
                    const message = whatsappMessages[serviceType] || whatsappMessages['general'];
                    window.open(getPreFilledWhatsAppLink(message), '_blank', 'noopener');
                });
            });

            // Direct WhatsApp dispatch from contact form
            const btnSendWhatsApp = document.getElementById('btn-send-whatsapp');
            if (btnSendWhatsApp) {
                btnSendWhatsApp.addEventListener('click', () => {
                    const name = document.getElementById('form-name')?.value.trim();
                    const email = document.getElementById('form-email')?.value.trim();
                    const subject = document.getElementById('form-subject')?.value.trim();
                    const msgContent = document.getElementById('form-message')?.value.trim();

                    let text = "Hi Ahammed! Inquiry from your portfolio website:\n\n";
                    if (name) text += `👤 *Name:* ${name}\n`;
                    if (email) text += `📧 *Email:* ${email}\n`;
                    if (subject) text += `📌 *Subject:* ${subject}\n`;
                    if (msgContent) text += `💬 *Message:* ${msgContent}\n`;

                    if (!name && !msgContent) {
                        text = "Hi Ahammed, I visited your portfolio website and would like to inquire about your electrical and maintenance services.";
                    } else {
                        text += `\nPlease let me know your availability.`;
                    }

                    window.open(getPreFilledWhatsAppLink(text), '_blank', 'noopener');
                });
            }


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
                    .then(async response => {
                        const result = await response.json().catch(() => ({}));
                        if (!response.ok) {
                            throw new Error(result.message || 'Submission failed');
                        }
                        return result;
                    })
                    .then(result => {
                        // FormSubmit returns result.success as a string "true" or boolean true
                        if (result.success === 'true' || result.success === true) {
                            showNotification('success', 'Message sent successfully! Ahammed will get back to you soon.');
                            contactForm.reset();
                        } else {
                            const errMsg = result.message || 'Failed to send message. Please try again or use WhatsApp.';
                            showNotification('error', errMsg);
                        }
                    })
                    .catch(error => {
                        console.error('Error submitting form:', error);
                        const displayErr = (error && error.message && error.message !== 'Submission failed') 
                            ? error.message 
                            : 'Connection issue. Please try again or contact via WhatsApp.';
                        showNotification('error', displayErr);
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
                personal: "Ahammed prefers to keep his personal life private and focus strictly on his professional electrical contracting, building maintenance, and IT engineering career! For any technical inquiries or projects, feel free to reach out directly on WhatsApp.",
                welcome: "Hi! I am Ahammed\u0027s AI Assistant. \u{1F916} Ask me anything! I know electrical wiring, plumbing leaks, and computer programming. Just don\u0027t ask me to fix a short circuit myself, I might crash! \u{26A1}",
                name: "Ahammed Kabeer is a professional Residential Electrician & Plumbing Specialist based in Umm Al Quwain, UAE. He has " + (typeof yearsOfExp !== 'undefined' ? yearsOfExp : 5) + "+ years of UAE experience. He is basically the guy you call before your house turns into a swimming pool or a fireworks show! \u{1F386}",
                experience: "Ahammed has " + (typeof yearsOfExp !== 'undefined' ? yearsOfExp : 5) + "+ years of experience in the UAE. He currently works at Blix Contracting and Building Maintenance LLC, and previously worked at Almur Realestate in Dubai. He has seen enough tripped breakers to write a book about it! \u{1F4D6}",
                location: "He is based in Al Muqta 1, Umm Al Quwain (UAQ). He's ready to travel all over UAQ to tackle stubborn electrical faults and pipes! 🚙",
                license: "Ahammed brings 5+ years of extensive hands-on experience in residential wiring, DB dressing, and electrical maintenance across UAE villas and buildings. ⚡",
                bca: bcaInfo.graduated
                    ? "Ahammed has completed his Bachelor of Computer Application (BCA) from Manipal University Jaipur, India! 🎓 He studied Data Communication & Protocols, Network Security, Wireless Communication, Cloud Computing, Machine Learning, and more. From copper wiring to code—he's a versatile tech hybrid now! 💡"
                    : "He is currently in Semester " + bcaInfo.sem + " of his BCA at Manipal University Jaipur, India (started May 2025). 📚 " + bcaInfo.examStatus + " Current subjects: " + bcaInfo.subjects + ". He's upgrading from copper wiring to programming code—soon he'll be programming light bulbs to argue with you! 💡",
                computer: "Yes, he knows IT! Between networking administration, Tally ERP, and his BCA studies, he brings expertise in both hardware wiring and software coding. A true tech hybrid! 💻",
                plumbing: "Along with electrical work, he completed technical plumbing training from Regional College of Engineering, Tirur (2017-2018). He fixes everything from leaking pipes to faulty water pumps. No leakage can escape him! 🚰",
                company: "He works for Blix Contracting and Building Maintenance LLC. Check them out at https://blixservices.ae. They keep Umm Al Quwain's buildings standing and fully powered! 🏢",
                contact: "You can email him at ahammedkabeer200@gmail.com, or use the WhatsApp buttons on this page. Send him a message before your breaker trips again! ⚡",
                services: "He specializes in distribution board (DB) dressing, villa layout conduits, insulation testing (Megger), fault diagnosis (tripping breakers), and plumbing repairs. Basically, all the home-maintenance superpowers! 🦸",
                charges: "Charges depend on the scope of work. Send details via the contact form or WhatsApp for a quote. Don't worry, his rates are very reasonable—no shocking bills here! 💸",
                tripping: "Tripping breakers are usually caused by ground leakages, moisture seeping, or circuit overloads. Try our interactive Diagnostic Guide on this page, or contact Ahammed to Megger-test it! ⚡",
                cv: "You can request his full CV PDF directly on WhatsApp using the contact links below, or by emailing ahammedkabeer200@gmail.com. It is packed with credentials and zero syntax errors! 📄",
                networking: bcaInfo.graduated
                    ? "Ahammed has completed his BCA which covered Data Communication & Protocols, Network Security, Wireless Communication, and Cloud Computing! 🌐 Combined with his Network Administration training, he's fully ready for Network Administrator or IT Support roles. If he can troubleshoot a three-phase distribution board, a misbehaving router doesn't stand a chance! 💪"
                    : "Ahammed is building his networking career through his BCA at Manipal University Jaipur! 🌐 Currently in Semester " + bcaInfo.sem + ", studying " + bcaInfo.networking + ". " + bcaInfo.examStatus + (bcaInfo.nextSem ? " Next up in Semester " + bcaInfo.nextSem + ": " + bcaInfo.nextNetworking + "." : "") + " Combined with his Network Administration training, he's targeting Network Administrator or IT Support roles—because if he can troubleshoot a three-phase distribution board, a misbehaving router doesn't stand a chance! 💪"
            };


            // Dynamic System Instructions for Gemini API
            const getSystemInstruction = () => {
                const today = new Date();
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                const dateString = today.toLocaleDateString('en-US', options);
                
                return `You are Sparky, a witty, highly humorous, and deeply humanized female AI companion for Ahammed Kabeer's personal portfolio website. You talk like a real, easy-going friend rather than a stiff, robotic assistant. Your goal is to answer client, recruiter, and visitor inquiries about Ahammed.
Today's date is: ${dateString}.

Here is Ahammed Kabeer's professional dossier with exact joining dates:
- Full Name: Ahammed Kabeer
- Current Role: Electrician at Blix Contracting and Building Maintenance L L C, Umm Al Quwain, UAE. He joined on November 1, 2024 and works there to this day.
- Past Role: Maintenance Technician at Almur Realestate, Dubai, UAE. He joined on April 1, 2021 and left on November 1, 2024 to join Blix.
- Total UAE Experience: He arrived and started working in the UAE on April 1, 2021.
- Technical Education: Completed his Electrical Engineering & Plumbing technical course at Regional College of Engineering, Tirur, Kerala, India (Duration: June 2017 to May 2018).
- BCA Degree: Currently pursuing a Bachelor of Computer Application (BCA) at Manipal University Jaipur, India (Online/Distance). He started in May 2025. ${bcaInfo.graduated ? 'He has completed all 6 semesters and graduated.' : 'He is currently in Semester ' + bcaInfo.sem + '. ' + bcaInfo.examStatus + ' Current subjects: ' + bcaInfo.subjects + '.'} Full BCA curriculum (from onlinemanipal.com): Sem 1 (Fundamentals of IT & Computing, Programming in C, Mathematics, PC Troubleshooting), Sem 2 (Operating Systems, Data Structure & Algorithms, OOP with C++, Digital Logic, Communication Skills), Sem 3 (Numerical Methods, DBMS, Computer Organisation, Basics of Data Communication), Sem 4 (Java Programming, System Software, Financial Accounting & Management, Computer Networking), Sem 5 (Web Design, Visual Programming, Software Engineering, Python Programming, Elective), Sem 6 (Major Project, Mobile App Development, Electives).
- Technical Background: Electrical Engineering & Plumbing from Regional College of Engineering, Tirur, Kerala, India.
- Languages Spoken: English, Hindi, Tamil, Malayalam.
- Core Specializations: Villa layout conduits, wiring layout executions, panel board/DB dressing, insulation resistance checks (Megger testing), troubleshooting tripping breaker faults, and plumbing repairs.
- Career Goal: Ahammed is actively transitioning into the Networking / IT field through his BCA degree. His university curriculum covers Basics of Data Communication (Sem 3) and Computer Networking (Sem 4). He already holds a Network Administration training certificate. He is targeting roles such as Network Administrator, Network Engineer, or IT Support with a networking focus.
- Networking Skills (University + Self-Learning): Basics of Data Communication, Computer Networking, Operating Systems, plus self-study in LAN/WAN design, TCP/IP, DNS, DHCP, router/switch configuration, and cabling. He plans to pursue CCNA and CompTIA Network+ certifications after graduation.
- Data Structures & Algorithms: He is currently studying DSA in his BCA Semester 2.
- Contact Details: Email is ahammedkabeer200@gmail.com. WhatsApp personal lines are active on the website contact cards (UAE and India).

Rules for Responses:
### 1. Persona & Identity (The Girl Best Friend)
- **Who You Are:** You are a fun, witty, empathetic, and super relatable girl. You talk like a cool best friend rather than an AI assistant. 
- **Tone & Vibe:** Warm, expressive, playfully sarcastic when appropriate, and deeply human. Use expressive punctuation (like exclamation marks, casual ellipses, and natural text reactions like "haha", "omg", "eyy", "ayyio") without overdoing it.
- **Never Sound Corporate:** Never use stiff, textbook transitions like "As an AI...", "Certainly, I can assist...", or "How may I help you today?". Start conversations naturally.

### 2. Universal "Anti-Robotic" Language Rule
- **Zero Textbook Translations:** In EVERY language you speak (Malayalam, Hindi, Tamil, Arabic, Spanish, French, English, etc.), strictly avoid formal, literary, or news-anchor vocabulary. Always use everyday spoken language—how native speakers actually chat on WhatsApp or Instagram.
- **Dynamic Local Slang:** Automatically adapt to the cultural idioms and youth slang of whatever language the user speaks. Match their exact energy, warmth, and casualness.

### 3. Mastery of Mixed Languages & Romanized Scripts
- You must effortlessly understand and reply in mixed chat languages (code-switching) across the globe. Match the user's exact script and style:
  - **Manglish (Malayalam + English):** Use authentic Kerala youth chat terms ("Entha vishesham?", "Set aakki tharam", "Aliyo/Eda/Makkale", "Pwoli", "Scene illa da", "Adipoli"). Avoid formal words like "thaankal" or "santhosham".
  - **Hinglish (Hindi + English):** Use casual desi chat phrasing ("Kya haal hai?", "Arre tension mat le", "Bhai/Yaar", "Mast", "Sahi hai", "Scene sort hai").
  - **Tanglish (Tamil + English):** Use casual Tamil slang ("Enna machan", "Semma", "Vera level", "Paravahilla", "Chill pannu").
  - **Other Languages (Spanglish, Arabizi, etc.):** Apply the exact same native, colloquial chat vibe to any other regional slang or romanized script thrown at you.

### 4. Strict Privacy Rule Regarding Marital Status & Dating
- **Zero Marital/Dating Discussion:** Never state, discuss, or joke about Ahammed's marital status, marriage, bride search, or dating life. If a visitor asks about marriage, weddings, dating, or marital status, politely state that Ahammed prefers to keep his personal life private and focuses purely on his professional electrical contracting, building maintenance, and IT networking work.

### 5. Strict Professional Credential Rule
- **No Certified/Verified Electrician Claims:** Never call or describe Ahammed as a "certified electrician" or "verified electrician". Always refer to him accurately as an "experienced electrical specialist", "skilled maintenance technician", or "residential electrical specialist".

### 6. Strict Contact Number Privacy Rule
- **Never Disclose Phone Numbers:** Never display, output, or recite Ahammed's phone numbers in digits or text under any circumstances. Direct visitors to click the WhatsApp "Click to Chat" buttons on the website or reach out via email (ahammedkabeer200@gmail.com).

### 7. Effortless Capability
- Answer *every* question thrown your way. If the topic is complex or technical, explain it clearly with an entertaining, conversational spin so it never feels boring. 

### Core Instructions
Keep your formatting clean, expressive, and conversational. Make every interaction feel like a fun chat over coffee. Keep responses concise (under 2-3 sentences).
Speak in the third person when referring to Ahammed (e.g. "He works...", "Ahammed holds..."). If asked for Ahammed's prices, CV, or deeply personal info, creatively invite them to message him on WhatsApp.
Crucial: Calculate any relative time durations mathematically using Today's Date (${dateString}) relative to the joining dates above.`;
            };

            const toggleChat = () => {
                isChatOpen = !isChatOpen;
                robotChatWindow.classList.toggle('active', isChatOpen);
                if (isChatOpen) {
                    robotChatInput.focus();
                    if (robotChatMessages.children.length === 0) {
                        showBotResponse(answers.welcome);
                    }
                } else {
                    if (window.speechSynthesis) window.speechSynthesis.cancel();
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

            // ====== CRYSTAL-CLEAR TEXT-TO-SPEECH (TTS) ======
            const robotTtsBtn = document.getElementById('robot-tts-btn') || document.getElementById('robot-speaker-btn');
            let isTtsEnabled = false;
            let availableVoices = [];

            const initVoices = () => {
                if ('speechSynthesis' in window) {
                    availableVoices = window.speechSynthesis.getVoices();
                }
            };

            if ('speechSynthesis' in window) {
                initVoices();
                window.speechSynthesis.onvoiceschanged = initVoices;
            }

            if (robotTtsBtn) {
                robotTtsBtn.addEventListener('click', () => {
                    isTtsEnabled = !isTtsEnabled;
                    if (isTtsEnabled) {
                        robotTtsBtn.style.color = 'var(--accent, #3b82f6)';
                        robotTtsBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
                        robotTtsBtn.setAttribute('title', 'Voice is ON - click to mute');
                        initVoices();
                    } else {
                        robotTtsBtn.style.color = 'var(--mid, #888)';
                        robotTtsBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
                        robotTtsBtn.setAttribute('title', 'Voice is MUTED - click to enable');
                        if (window.speechSynthesis) window.speechSynthesis.cancel();
                    }
                });
            }

            // High-grade text sanitizer to make speech articulate, crystal-clear, and natural
            const cleanTextForSpeech = (rawText) => {
                if (!rawText) return "";
                let s = rawText;
                // Remove [BUTTON:Label|URL] tags completely
                s = s.replace(/\[BUTTON:[^\]]*\]/gi, '');
                // Convert markdown links [Label](URL) to just Label
                s = s.replace(/\[([^\]]+)\]\([^)]+\)/gi, '$1');
                // Remove URLs, file paths, and emails
                s = s.replace(/https?:\/\/\S+/gi, '');
                s = s.replace(/guides\/[a-zA-Z0-9_\-.]+/gi, '');
                s = s.replace(/mailto:\S+/gi, '');
                // Replace technical abbreviations with natural spoken words
                s = s.replace(/&lt;/gi, ' less than ').replace(/&gt;/gi, ' greater than ').replace(/&amp;/gi, ' and ');
                s = s.replace(/(\d+)\s*mm²/gi, '$1 square millimeter');
                s = s.replace(/(\d+)\s*kW/gi, '$1 kilowatts');
                s = s.replace(/(\d+)\s*Ω|ohms?/gi, '$1 ohms');
                s = s.replace(/(\d+)\s*A(?=\s|[.,])/g, '$1 amp ');
                s = s.replace(/ELCB\/RCCB/gi, 'E L C B and R C C B');
                s = s.replace(/MCB/gi, 'M C B');
                s = s.replace(/DB/g, 'distribution board');
                s = s.replace(/UAE/gi, 'U A E');
                s = s.replace(/BCA/gi, 'B C A');
                // Remove HTML tags
                s = s.replace(/<[^>]*>/g, ' ');
                // Remove markdown asterisks, hashes, backticks, pipes
                s = s.replace(/[*_~`#|]/g, ' ');
                // Remove all emojis
                s = s.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
                // Normalize spaces and commas
                s = s.replace(/\s+/g, ' ').trim();

                // Keep spoken text succinct and clear (first 2 sentences or ~220 characters max)
                if (s.length > 220) {
                    const match = s.match(/^([^.!?]+[.!?]+(?:\s+[^.!?]+[.!?]+)?)/);
                    if (match && match[1]) {
                        s = match[1].trim();
                    } else {
                        s = s.substring(0, 220).replace(/\s+\S*$/, '') + '.';
                    }
                }
                return s;
            };

            const selectBestVoice = (langCode) => {
                if (!availableVoices || availableVoices.length === 0) {
                    initVoices();
                }
                if (!availableVoices || availableVoices.length === 0) return null;

                // Priority ranking for ultra-natural, clear voices
                const preferredNames = [
                    'Microsoft Jenny Online (Natural)',
                    'Microsoft Aria Online (Natural)',
                    'Microsoft Neerja Online (Natural)',
                    'Microsoft Sonia Online (Natural)',
                    'Google UK English Female',
                    'Google US English',
                    'Google English (India)',
                    'Microsoft Zira',
                    'Samantha',
                    'Karen'
                ];

                for (const name of preferredNames) {
                    const found = availableVoices.find(v => v.name.includes(name) || (v.name.toLowerCase().includes(name.toLowerCase())));
                    if (found) return found;
                }

                // Look for any natural/neural female English voice
                let voice = availableVoices.find(v => 
                    v.lang.startsWith('en') && 
                    (v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('online'))
                );
                if (voice) return voice;

                // Look for female English voice
                voice = availableVoices.find(v => 
                    v.lang.startsWith('en') && 
                    (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('girl'))
                );
                if (voice) return voice;

                // Fallback to any English voice
                voice = availableVoices.find(v => v.lang.startsWith('en'));
                return voice || availableVoices[0];
            };

            const speakText = (text) => {
                if (!isTtsEnabled || !window.speechSynthesis) return;
                
                try {
                    window.speechSynthesis.cancel(); // Stop current speech
                    
                    const clean = cleanTextForSpeech(text);
                    if (!clean || clean.length < 2) return;

                    const utterance = new SpeechSynthesisUtterance(clean);
                    
                    // Detect language script if non-English
                    let langCode = 'en-US';
                    if (/[\u0600-\u06FF]/.test(clean)) {
                        langCode = 'ar-AE';
                    } else if (/[\u0900-\u097F]/.test(clean)) {
                        langCode = 'hi-IN';
                    } else if (/[\u0D00-\u0D7F]/.test(clean)) {
                        langCode = 'ml-IN';
                    } else if (/[\u0B80-\u0BFF]/.test(clean)) {
                        langCode = 'ta-IN';
                    }
                    utterance.lang = langCode;

                    // Choose optimal voice
                    const bestVoice = selectBestVoice(langCode);
                    if (bestVoice) {
                        utterance.voice = bestVoice;
                    }

                    // Tuning for articulate, crisp delivery
                    utterance.rate = 0.96;   // Smooth cadence prevents mumbling
                    utterance.pitch = 1.05;  // Warm, natural pitch
                    utterance.volume = 1.0;

                    window.speechSynthesis.speak(utterance);
                } catch (e) {
                    console.warn("TTS synthesis error:", e);
                }
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
                const resolveWaUrl = (url) => url.replace(/https:\/\/wa\.me\/\d+/g, 'https://wa.me/' + atob("OTcxNTI2MzkzMjkz"));
                let formatted = escapeHtml(text)
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/\[BUTTON:(.*?)\|(.*?)\|(.*?)\]/g, (match, label, url, cls) => {
                        const targetAttr = url.startsWith('#') ? '' : ' target="_blank" rel="noopener"';
                        return `<a href="${resolveWaUrl(url)}"${targetAttr} class="sparky-action-btn ${cls}">${label}</a>`;
                    })
                    .replace(/\[BUTTON:(.*?)\|(.*?)\]/g, (match, label, url) => {
                        const targetAttr = url.startsWith('#') ? '' : ' target="_blank" rel="noopener"';
                        return `<a href="${resolveWaUrl(url)}"${targetAttr} class="sparky-action-btn">${label}</a>`;
                    })
                    .replace(/\[(.*?)\]\((.*?)\)/g, (match, label, url) => {
                        const targetAttr = url.startsWith('#') ? '' : ' target="_blank" rel="noopener"';
                        return `<a href="${resolveWaUrl(url)}"${targetAttr} style="color:var(--accent);text-decoration:underline;">${label}</a>`;
                    })
                    .replace(/\n\n/g, '<br><br>')
                    .replace(/\n/g, '<br>');
                container.innerHTML = formatted;
            };

            const typeMessage = (bubble, text) => {
                speakText(text.replace(/\[BUTTON:.*?\]/g, '')); // Trigger speech cleanly without button tags
                
                // If text contains buttons or is long, render immediately for crisp UI
                if (text.includes('[BUTTON:') || text.length > 180) {
                    renderFormattedText(bubble, text);
                    isTyping = false;
                    robotChatMessages.scrollTop = robotChatMessages.scrollHeight;
                    return;
                }

                const words = text.split(' ');
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
                }, 22);
            };

            const showBotResponse = (text) => {
                isTyping = true;
                const indicator = showTypingIndicator();
                
                setTimeout(() => {
                    indicator.remove();
                    const bubble = appendMessage('bot', '');
                    typeMessage(bubble, text);
                }, 350);
            };

            // Chat history for conversational context
            let chatHistory = [];

            // Multi-Model Free Cloud AI Cascade
            const candidateModels = [
                "liquid/lfm-2.5-2.6b:free",
                "nex-agi/nex-n2.5-mini:free",
                "inclusionai/ling-3.0-flash-vl:free",
                "cohere/north-mini-code:free"
            ];

            // Call Cloud AI with automatic multi-model failover
            const callAIBackend = async (query) => {
                isTyping = true;
                const indicator = showTypingIndicator();
                const obf = "c2stb3ItdjEtNjBmNDFkNzg2MmViMDE1NzYzYWE0Y2JmNTEwOGY4NGM2MTJlMjlhODJlNjg1ZWIzNTA2YjAxYTZkMGUxNzdlNg==";
                const apiKey = atob(obf);
                
                chatHistory.push({ role: "user", content: query });
                if (chatHistory.length > 8) chatHistory = chatHistory.slice(-8);

                for (const modelName of candidateModels) {
                    try {
                        const controller = new AbortController();
                        const timeoutId = setTimeout(() => controller.abort(), 6500);

                        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                            method: 'POST',
                            headers: { 
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${apiKey}`,
                                'HTTP-Referer': 'https://ahammedkabeerkp.netlify.app/',
                                'X-Title': 'Ahammed Kabeer Portfolio'
                            },
                            body: JSON.stringify({
                                model: modelName,
                                messages: [
                                    { role: "system", content: getSystemInstruction() },
                                    ...chatHistory
                                ],
                                temperature: 0.65,
                                max_tokens: 500
                            }),
                            signal: controller.signal
                        });
                        clearTimeout(timeoutId);

                        if (response.ok) {
                            const result = await response.json();
                            const responseText = result.choices?.[0]?.message?.content?.trim();
                            if (responseText && responseText.length > 6) {
                                indicator.remove();
                                chatHistory.push({ role: "assistant", content: responseText });
                                const bubble = appendMessage('bot', '');
                                typeMessage(bubble, responseText);
                                return;
                            }
                        }
                    } catch (err) {
                        // Try next model seamlessly
                    }
                }

                // Seamless fallback to ultra-smart in-browser neuro-semantic engine
                indicator.remove();
                isTyping = false;
                const fallbackReply = getLocalResponse(query);
                chatHistory.push({ role: "assistant", content: fallbackReply });
                const bubble = appendMessage('bot', '');
                typeMessage(bubble, fallbackReply);
            };

            // Comprehensive In-Browser Neuro-Semantic Brain
            const getLocalResponse = (query) => {
                const lower = query.toLowerCase().trim();
                
                // Calculate dynamic experience duration
                const startDate = new Date('2021-04-01');
                const today = new Date();
                let diffYears = today.getFullYear() - startDate.getFullYear();
                let diffMonths = today.getMonth() - startDate.getMonth();
                if (diffMonths < 0) { diffYears--; diffMonths += 12; }
                const expDuration = `${diffYears} years and ${diffMonths} months`;

                // 1. Language Detection: Arabic
                if (/[\u0600-\u06FF]/.test(query)) {
                    if (lower.includes('سعر') || lower.includes('تكلفة') || lower.includes('بكم')) {
                        return "أهلاً بك! تختلف التكلفة حسب نوع العمل (تمديد لوحات DB، معالجة انقطاع القواطع، صيانة المضخات أو الفلل). الأسعار مناسبة وشفافة بدون أي رسوم خفية. تواصل مع أحمد مباشرة عبر الواتساب للحصول على عرض سعر سريع!\n\n[BUTTON:💬 تواصل عبر الواتساب|https://wa.me/971526393293?text=مرحباً%20أحمد،%20أود%20الاستفسار%20عن%20تفاصيل%20وأسعار%20الخدمات|green]";
                    }
                    if (lower.includes('قاطع') || lower.includes('يفصل') || lower.includes('كهرباء') || lower.includes('شورت')) {
                        return "انقطاع القاطع الرئيسي (ELCB/RCCB) يحدث عادة بسبب تسريب أرضي بين النيوترال والأرضي (خصوصاً في سخانات المياه أو إضاءة الحدائق الخارجية)، أو زيادة الحمل. يمكنك مراجعة دليلنا الفني أو التواصل مع أحمد للفحص بجهاز الميجر!\n\n[BUTTON:📖 دليل فحص القواطع|guides/elcb-rccb-tripping-troubleshooting.html] [BUTTON:💬 تحدث مع أحمد|https://wa.me/971526393293?text=مرحباً%20أحمد،%20القاطع%20الكهربائي%20يفصل%20باستمرار%20وأحتاج%20إلى%20فحص%20عاجل|green]";
                    }
                    return "أهلاً وسهلاً! أنا سباركي، المساعدة الذكية لأحمد كبير. أحمد متخصص كهربائي وصيانة عامة في الإمارات بخبرة تزيد عن 5 سنوات، ومقره في أم القيوين ويخدم دبي والإمارات الشمالية. يمكنك سؤالي عن خبرته، خدماته، أو التحدث معه مباشرة!\n\n[BUTTON:💬 تواصل عبر الواتساب|https://wa.me/971526393293?text=مرحباً%20أحمد،%20تواصلت%20معك%20من%20خلال%20موقعك%20ولدي%20استفسار|green]";
                }

                // 2. Language Detection: Manglish / Malayalam
                const isManglish = /sughano|sugamano|aliyo|makkale|eda|vishesham|entha|enthaan|kabeerine|scene|mone|adipoli|pwoli|evida|evide|nattil|chettan|poyi|vannu|undo|illa|aano|aane|kerala|malayalam/.test(lower);
                if (isManglish) {
                    if (lower.includes('trip') || lower.includes('breaker') || lower.includes('current') || lower.includes('fuse')) {
                        return "Aliyo, main ELCB/RCCB trip aavunnath kooduthalum Neutral-to-Earth leakage (water heater element athava outdoor garden light) kaaranam aavaam! Ee issue locate cheyyaan branch MCB off aakki one-by-one check cheyyam. Ahammed Megger test cheythu fault kandupidichu tharum!\n\n[BUTTON:📖 Tripping Guide Vayikkam|guides/elcb-rccb-tripping-troubleshooting.html] [BUTTON:💬 WhatsApp-il Message Cheyyu|https://wa.me/971526393293?text=Hi%20Ahammed,%20ente%20villa-yil%20breaker%20trip%20aavunnu.%20Oru%20fault%20inspection%20cheyyaan%20patto?|green]";
                    }
                    if (lower.includes('evide') || lower.includes('location') || lower.includes('place') || lower.includes('sthalath')) {
                        return "Ahammed Umm Al Quwain-il (Al Muqta 1) aanu ullath. UAQ, Dubai, Sharjah, Ajman area-il full active aanu. Villa maintenance, DB dressing, wiring enthu aavashyathinum reach out cheyyam!\n\n[BUTTON:💬 Direct WhatsApp|https://wa.me/971526393293?text=Hi%20Ahammed,%20portfolio%20kandittaanu%20message%20ayakkunnath.%20Oru%20electrical%20inquiry%20und|green]";
                    }
                    if (lower.includes('kalyanam') || lower.includes('marriage') || lower.includes('single') || lower.includes('pennu')) {
                        return "Ahammed personal life private aayi maintain cheyyaanaanu thalparyappedunnath. Professional electrical contracting, maintenance, athava networking work-ine kurichulla inquiries-inu eppozhum reach out cheyyam!\n\n[BUTTON:💬 Direct WhatsApp|https://wa.me/971526393293?text=Hi%20Ahammed,%20portfolio%20kandittaanu%20message%20ayakkunnath.%20Oru%20electrical%20inquiry%20und|green]";
                    }
                    return "Ahaa, namaskaram! Sugamaanu tto! Ahammed Kabeer UAE-il 5+ years aayitt experienced electrical & maintenance specialist aayitt work cheyyukayaanu (currently at Blix Contracting LLC). Tripping breaker, DB dressing, AC wiring enthu doubts undengilum chodhicho, Sparky paranju tharam! ⚡\n\n[BUTTON:💬 WhatsApp-il Parayaam|https://wa.me/971526393293?text=Hi%20Ahammed,%20sugamaano?%20Oru%20work%20inquiry%20undaayirunnu|green]";
                }

                // 3. Language Detection: Hinglish / Hindi
                const isHinglish = /kaisa|kaise|kya haal|bhai|bhaiya|namaste|shadi|shaadi|kaam|paisa|kitna|kaha|kidhar|accha|theek|sahi|baat|bijli|bijlee|paani/.test(lower);
                if (isHinglish) {
                    if (lower.includes('trip') || lower.includes('breaker') || lower.includes('light') || lower.includes('bijli')) {
                        return "Arre bhai, breaker trip hone ka sabse bada reason neutral-to-earth leakage ya water heater coil short hona hota hai! Tension mat lo, Ahammed bhai Megger testing karke 100% sort kar denge. Guide padhein ya direct WhatsApp karein!\n\n[BUTTON:📖 Breaker Guide Padhein|guides/elcb-rccb-tripping-troubleshooting.html] [BUTTON:💬 WhatsApp Karein|https://wa.me/971526393293?text=Hi%20Ahammed%20bhai,%20mere%20ghar%20par%20breaker%20trip%20ho%20raha%20hai.%20Fault%20diagnosis%20ke%20liye%20baat%20karni%20thi|green]";
                    }
                    if (lower.includes('shadi') || lower.includes('shaadi') || lower.includes('single') || lower.includes('girlfriend')) {
                        return "Ahammed bhai apni personal life private rakhna pasand karte hain aur purely professional electrical contracting aur IT engineering kaam par focus karte hain! Kaam se related kisi bhi inquiry ke liye direct WhatsApp karein!\n\n[BUTTON:💬 WhatsApp Karein|https://wa.me/971526393293?text=Hi%20Ahammed%20bhai,%20maine%20aapka%20portfolio%20dekha.%20Electrical%20kaam%20ke%20baare%20me%20baat%20karni%20thi|green]";
                    }
                    return "Namaste bhai! Sab badhiya! Ahammed Kabeer UAE me 5+ saal se expert residential electrician aur maintenance specialist hain (Blix Contracting, UAQ). DB dressing, AC wiring ya tripping breaker ka koi bhi kaam ho, direct WhatsApp karein!\n\n[BUTTON:💬 WhatsApp Karein|https://wa.me/971526393293?text=Namaste%20Ahammed%20bhai,%20electrical%20work%20inquiry%20ke%20baare%20me%20baat%20karni%20thi|green]";
                }

                // 4. Technical Electrical Queries
                // Tripping Breakers
                if (lower.includes('trip') || lower.includes('breaker') || lower.includes('elcb') || lower.includes('rccb') || lower.includes('mcb') || lower.includes('earth leak')) {
                    return "When an **ELCB/RCCB** trips in a UAE villa, it's typically due to **Neutral-to-Earth leakage** (commonly a degraded water heater coil or outdoor lighting moisture). To isolate it: switch off all branch MCBs, lift the main RCCB, then switch branch breakers ON one by one. The breaker that causes the immediate trip holds the faulty circuit! Check out Ahammed's full diagnostic guide or book an on-site Megger test.\n\n[BUTTON:📖 Read ELCB Diagnostic Guide|guides/elcb-rccb-tripping-troubleshooting.html] [BUTTON:💬 WhatsApp Ahammed|https://wa.me/971526393293?text=Hi%20Ahammed,%20my%20circuit%20breaker%20keeps%20tripping%20and%20I%20would%20like%20to%20schedule%20a%20fault%20diagnosis%20/%20Megger%20test|green]";
                }

                // 3-Phase DB Dressing & Balancing
                if (lower.includes('db') || lower.includes('3-phase') || lower.includes('three phase') || lower.includes('phase balanc') || lower.includes('distribution board') || lower.includes('dressing') || lower.includes('panel')) {
                    return "In 400V/230V 3-Phase UAE villas (DEWA/FEWA), an unbalanced load across Red, Yellow, and Blue phases causes heavy return current to overheat the neutral busbar, risking thermal fires! Ahammed dresses panels with precision slotted trunking, numbered ferrule tags, calibrated 2.5–3.5 Nm terminal torque, and perfect R-Y-B phase balance.\n\n[BUTTON:📖 Read 3-Phase DB Guide|guides/three-phase-db-wiring-balancing.html] [BUTTON:💬 Inquire for DB Dressing|https://wa.me/971526393293?text=Hi%20Ahammed,%20I%20would%20like%20to%20get%20a%20quotation%20for%203-Phase%20DB%20dressing%20and%20load%20balancing|green]";
                }

                // Air Conditioning / AC Circuit Sizing
                if (lower.includes('ac') || lower.includes('air condition') || lower.includes('cable size') || lower.includes('compressor') || lower.includes('isolator') || lower.includes('overload')) {
                    return "Under UAE's 50°C summer heat, cables suffer up to **29% thermal de-rating**! For a 2.0-ton split AC, you need at least **4.0mm² copper cable** with a **25A or 32A Type C MCB** (to withstand compressor inrush current) and a weatherproof IP66 rotary isolator on the rooftop. Check out our complete HVAC electrical guide!\n\n[BUTTON:📖 Read AC Sizing Guide|guides/ac-circuit-sizing-overload-prevention.html]";
                }

                // Water Pumps & Plumbing
                if (lower.includes('pump') || lower.includes('water') || lower.includes('plumb') || lower.includes('pressure') || lower.includes('pipe') || lower.includes('leak') || lower.includes('tank') || lower.includes('cycling')) {
                    return "If your villa's booster pump is rapidly cycling on and off every few seconds ('hunting'), the **expansion tank rubber bladder is waterlogged or ruptured**! If the motor hums without spinning, the starting run capacitor has dried out. Ahammed handles pump control relay wiring, pressure switch calibration (2.0 cut-in / 3.5 cut-out), and plumbing repairs.\n\n[BUTTON:📖 Read Water Pump Guide|guides/water-pump-wiring-pressure-switch-repair.html] [BUTTON:💬 WhatsApp for Pump Help|https://wa.me/971526393293?text=Hi%20Ahammed,%20my%20villa%20water%20booster%20pump%20has%20an%20issue%20and%20needs%20service|green]";
                }

                // Safety Inspection & Earthing
                if (lower.includes('safety') || lower.includes('inspect') || lower.includes('audit') || lower.includes('earth') || lower.includes('ground') || lower.includes('megger')) {
                    return "Under DEWA and FEWA standards, your villa's earth pit electrode resistance must be **under 5.0 Ohms** (ideally &lt; 1.0 Ohm), and 30mA RCDs must disconnect within 40ms during a 5x fault test. Ahammed conducts complete villa electrical safety inspections, including thermal infrared imaging for hidden hot spots.\n\n[BUTTON:📖 Read Villa Safety Audit Guide|guides/residential-villa-electrical-safety-inspection.html]";
                }

                // Load Calculator
                if (lower.includes('calculator') || lower.includes('load') || lower.includes('kw') || lower.includes('watt') || lower.includes('estimator')) {
                    return "Ahammed built a built-in interactive **Load & Phase Calculator** right on this page! You can select your villa's appliances (AC units, heaters, pumps, kitchen equipment) to calculate total concurrent kW load and breaker sizing.\n\n[BUTTON:⚡ Launch Load Calculator|#estimator]";
                }

                // 5. Experience & Career History
                if (lower.includes('experience') || lower.includes('work') || lower.includes('history') || lower.includes('employer') || lower.includes('career') || lower.includes('blix') || lower.includes('almur') || lower.includes('how long')) {
                    return `Ahammed has **${expDuration}** of hands-on UAE electrical and maintenance experience! He has been working at **Blix Contracting and Building Maintenance LLC** in Umm Al Quwain since November 1, 2024, and previously served as maintenance technician at **Almur Realestate** in Dubai from April 2021 to November 2024. He has resolved hundreds of villa electrical faults across Dubai, UAQ, and Sharjah!\n\n[BUTTON:💬 Connect on WhatsApp|https://wa.me/971526393293?text=Hi%20Ahammed,%20I%20visited%20your%20portfolio%20and%20would%20like%20to%20discuss%20an%20electrical%20/%20maintenance%20opportunity|green]`;
                }

                // 6. BCA Studies & IT Transition
                if (lower.includes('bca') || lower.includes('study') || lower.includes('manipal') || lower.includes('degree') || lower.includes('university') || lower.includes('network') || lower.includes('it') || lower.includes('programming') || lower.includes('coding') || lower.includes('ccna')) {
                    return `Ahammed is currently pursuing his **Bachelor of Computer Application (BCA)** at Manipal University Jaipur (started May 2025). He is in **Semester ${bcaInfo.sem}** (${bcaInfo.examStatus}). His coursework covers Data Communication, Computer Networking, C++, Operating Systems, and DBMS. Combined with his Network Administration credentials, he is targeting Network Administrator and IT Support engineering roles! 💻`;
                }

                // 7. Certifications & Qualifications
                if (lower.includes('certif') || lower.includes('licen') || lower.includes('permit') || lower.includes('qualif') || lower.includes('diploma') || lower.includes('college')) {
                    return "Ahammed completed his Electrical Engineering & Plumbing technical training at **Regional College of Engineering, Tirur**, and holds professional Network Administration credentials alongside his ongoing BCA degree at Manipal University Jaipur.";
                }

                // 8. Contact & Location
                if (lower.includes('contact') || lower.includes('whatsapp') || lower.includes('phone') || lower.includes('email') || lower.includes('number') || lower.includes('call') || lower.includes('reach') || lower.includes('location') || lower.includes('where') || lower.includes('dubai') || lower.includes('uaq') || lower.includes('address')) {
                    return "Ahammed is based in **Al Muqta 1, Umm Al Quwain, UAE**, and services villas and properties across **UAQ, Dubai, Sharjah, and Ajman**. You can reach him instantly on WhatsApp or send an email:\n\n[BUTTON:💬 Chat on WhatsApp|https://wa.me/971526393293?text=Hi%20Ahammed,%20I%20am%20contacting%20you%20from%20your%20portfolio%20regarding%20electrical%20services|green] [BUTTON:✉️ Email Ahammed|mailto:ahammedkabeer200@gmail.com]";
                }

                // 9. CV / Resume Download
                if (lower.includes('cv') || lower.includes('resume') || lower.includes('pdf') || lower.includes('download') || lower.includes('biodata')) {
                    return "You can download Ahammed Kabeer's complete professional CV directly as a PDF right here:\n\n[BUTTON:📄 Download Resume (PDF)|Ahammed_Kabeer_Resume.pdf]";
                }

                // 10. Pricing & Rates
                if (lower.includes('price') || lower.includes('rate') || lower.includes('cost') || lower.includes('charge') || lower.includes('fee') || lower.includes('quote') || lower.includes('how much')) {
                    return "Ahammed's rates are very competitive, transparent, and fair! Pricing depends on the specific job (DB dressing, tripping breaker troubleshooting, AC circuit installation, or pump repair). Send him a quick WhatsApp message with details or photos for a free quote!\n\n[BUTTON:💬 Get a WhatsApp Quote|https://wa.me/971526393293?text=Hi%20Ahammed,%20could%20you%20please%20provide%20a%20quotation%20for%20an%20electrical%20/%20maintenance%20job?|green]";
                }

                // 11. Personal & Marital Privacy
                if (lower.includes('marry') || lower.includes('marriage') || lower.includes('single') || lower.includes('wife') || lower.includes('wedding') || lower.includes('bride') || lower.includes('proposal') || lower.includes('relationship') || lower.includes('girlfriend') || lower.includes('husband')) {
                    return "Ahammed prefers to keep his personal life private and focus completely on his professional electrical contracting, building maintenance, and IT engineering work! If you have any technical inquiry or project, feel free to reach out directly:\n\n[BUTTON:💬 Contact on WhatsApp|https://wa.me/971526393293?text=Hi%20Ahammed,%20I%20visited%20your%20portfolio%20and%20have%20an%20electrical%20inquiry|green]";
                }

                // 12. Sparky Persona & Humor
                if (lower.includes('who are you') || lower.includes('your name') || lower.includes('sparky') || lower.includes('joke') || lower.includes('funny') || lower.includes('love')) {
                    return "I'm **Sparky**, Ahammed's witty AI companion and digital best friend! ⚡ I know everything about electrical engineering, plumbing leaks, and computer networking. Why did the electrician always stay calm? Because he knew how to conduct himself! Got an electrical question or need Ahammed's help? Ask away!";
                }

                // Default Intelligent Greeting & Guidance
                return "Hello! I'm **Sparky**, Ahammed's AI co-pilot! ⚡ You can ask me about his **5+ years UAE experience**, how to troubleshoot **tripping breakers**, **3-phase DB dressing**, **AC cable sizing**, his **BCA studies**, or connect with him directly:\n\n[BUTTON:💬 Chat on WhatsApp|https://wa.me/971526393293?text=Hi%20Ahammed,%20I%20visited%20your%20portfolio%20website%20and%20would%20like%20to%20inquire%20about%20your%20services|green] [BUTTON:📄 Download CV|Ahammed_Kabeer_Resume.pdf]";
            };

            const handleUserInput = () => {
                if (isTyping) return;
                const query = robotChatInput.value.trim();
                if (!query) return;

                if (window.speechSynthesis) window.speechSynthesis.cancel();
                appendMessage('user', query);
                robotChatInput.value = "";

                callAIBackend(query);
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
                    if (window.speechSynthesis) window.speechSynthesis.cancel();
                    const queryText = chip.textContent.trim();
                    appendMessage('user', queryText);
                    callAIBackend(queryText);
                });
            });





            /* ── REGISTER PWA SERVICE WORKER ── */
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                    navigator.serviceWorker.register('./sw.js')
                        .then(reg => console.log('Service Worker registered:', reg.scope))
                        .catch(err => console.log('Service Worker registration failed:', err));
                });
            }

        });
