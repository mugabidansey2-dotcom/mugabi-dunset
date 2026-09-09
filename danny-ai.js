// ═══════════════════════════════════════════════════════════════════════════
// DANNY AI — Floating chat assistant for Mugabi Dunset's portfolio
// ═══════════════════════════════════════════════════════════════════════════

(function () {
    'use strict';

    // ── Knowledge base ────────────────────────────────────────────────────────
    const knowledge = [
        {
            keys: ['who', 'mugabi', 'dunset', 'danny', 'you', 'about', 'yourself'],
            reply: "I'm Danny, the AI assistant for <strong>Mugabi Dunset</strong> — a Graphics Designer, Streamer, Web Developer and Freelancer based in Bugema, Uganda. 🇺🇬"
        },
        {
            keys: ['skill', 'know', 'can', 'do', 'expertise', 'good at'],
            reply: "Mugabi is skilled in <strong>HTML, CSS, JavaScript, Java & React</strong> for development, and uses <strong>Photoshop, Illustrator, Premiere Pro & OBS Studio</strong> for creative work. He also does Graphic Design, Branding, Photography and Video Editing. 🎨"
        },
        {
            keys: ['project', 'work', 'portfolio', 'built', 'made', 'design'],
            reply: "Mugabi has worked on the <strong>SDA Church Bugema University</strong> website, plus several graphic design and visual communication projects on <strong>Behance</strong>. Check the Projects page for more! 💼"
        },
        {
            keys: ['contact', 'reach', 'message', 'hire', 'whatsapp', 'talk'],
            reply: "You can reach Mugabi on WhatsApp at <strong>+256 757 908 094</strong> or use the contact form on the Contact page. He's open to freelance work and collaborations! 📩"
        },
        {
            keys: ['social', 'instagram', 'behance', 'github', 'linkedin', 'threads', 'follow'],
            reply: "Follow Mugabi on:<br>📸 <a href='https://www.instagram.com/dansetdannie/' target='_blank'>Instagram</a><br>🎨 <a href='https://www.behance.net/mugabidansey' target='_blank'>Behance</a><br>💻 <a href='https://github.com/mugabidansey2-dotcom' target='_blank'>GitHub</a><br>💼 <a href='https://www.linkedin.com/in/mugabi-dunset-696808397/' target='_blank'>LinkedIn</a><br>🧵 <a href='https://www.threads.com/@dansetdannie' target='_blank'>Threads</a>"
        },
        {
            keys: ['location', 'where', 'country', 'uganda', 'bugema', 'based', 'live'],
            reply: "Mugabi is based in <strong>Bugema, Uganda</strong> 🌍. He works both on-campus at Bugema University and as a freelancer for clients everywhere."
        },
        {
            keys: ['experience', 'job', 'work history', 'career', 'marketeer', 'streamer', 'freelance'],
            reply: "Mugabi has been a <strong>Graphics Designer, Streamer & Freelancer</strong> since 2023, and previously worked as a <strong>Marketeer at Bugema University</strong> from 2022–2023. 🏫"
        },
        {
            keys: ['hello', 'hi', 'hey', 'sup', 'greet', 'good morning', 'good evening', 'hola'],
            reply: "Hey there! 👋 I'm <strong>Danny</strong>, Mugabi's AI assistant. Ask me anything about his skills, projects, experience or how to get in touch!"
        },
        {
            keys: ['thank', 'thanks', 'appreciate', 'cool', 'nice', 'great', 'awesome'],
            reply: "You're welcome! 😊 Is there anything else you'd like to know about Mugabi?"
        },
        {
            keys: ['bye', 'goodbye', 'see you', 'later', 'ciao'],
            reply: "Goodbye! 👋 Feel free to come back anytime. Don't forget to check out Mugabi's projects!"
        },
        {
            keys: ['sdac', 'church', 'bugema university', 'sda', 'website'],
            reply: "The <strong>SDA Church Bugema University</strong> site is a responsive digital ministry website that Mugabi contributed to. You can visit it live at <a href='https://sdac.bugemauniv.ac.ug/' target='_blank'>sdac.bugemauniv.ac.ug</a> 🙏"
        },
        {
            keys: ['stream', 'obs', 'live', 'youtube', 'twitch', 'content'],
            reply: "Mugabi is a live streamer using <strong>OBS Studio</strong>. He creates and streams content at Bugema University as part of his creative role. 🎥"
        },
        {
            keys: ['price', 'cost', 'rate', 'charge', 'fee', 'quote', 'how much'],
            reply: "For pricing and quotes, reach out directly to Mugabi on WhatsApp at <strong>+256 757 908 094</strong> — rates depend on the project scope. 💰"
        },
    ];

    const fallbacks = [
        "Hmm, I'm not sure about that! Try asking about Mugabi's <strong>skills</strong>, <strong>projects</strong>, <strong>experience</strong> or how to <strong>contact</strong> him. 🤔",
        "I don't have an answer for that yet. Try asking about his <strong>work</strong>, <strong>social media</strong> or <strong>location</strong>! 😅",
        "Good question! But that's beyond my knowledge. Ask me about Mugabi's <strong>design skills</strong>, <strong>projects</strong> or <strong>contact details</strong>. 💡"
    ];

    function getReply(input) {
        const lower = input.toLowerCase();
        for (const item of knowledge) {
            if (item.keys.some(k => lower.includes(k))) {
                return item.reply;
            }
        }
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    // ── Build UI ──────────────────────────────────────────────────────────────
    function buildUI() {
        const style = document.createElement('style');
        style.textContent = `
            /* ── Danny AI Widget ── */
            #danny-ai-btn {
                position: fixed;
                bottom: 2rem;
                left: 2rem;
                width: 56px;
                height: 56px;
                border-radius: 50%;
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                border: none;
                cursor: pointer;
                z-index: 99990;
                box-shadow: 0 4px 20px rgba(99,102,241,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
                animation: dannyPulse 2.5s ease-in-out infinite;
            }
            @keyframes dannyPulse {
                0%,100% { box-shadow: 0 4px 20px rgba(99,102,241,0.5); }
                50%      { box-shadow: 0 4px 32px rgba(139,92,246,0.8), 0 0 0 8px rgba(99,102,241,0.15); }
            }
            #danny-ai-btn:hover {
                transform: scale(1.1);
                animation: none;
                box-shadow: 0 6px 28px rgba(99,102,241,0.7);
            }
            #danny-ai-btn svg { width: 26px; height: 26px; fill: #fff; }

            #danny-ai-window {
                position: fixed;
                bottom: 6rem;
                left: 2rem;
                width: 320px;
                max-height: 460px;
                background: rgba(10,10,15,0.96);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(99,102,241,0.3);
                border-radius: 16px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1);
                z-index: 99989;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                transform: scale(0.85) translateY(20px);
                opacity: 0;
                pointer-events: none;
                transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease;
            }
            #danny-ai-window.open {
                transform: scale(1) translateY(0);
                opacity: 1;
                pointer-events: all;
            }

            /* Header */
            #danny-ai-header {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.85rem 1rem;
                background: linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.15));
                border-bottom: 1px solid rgba(99,102,241,0.2);
            }
            .danny-avatar {
                width: 36px; height: 36px;
                border-radius: 50%;
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                display: flex; align-items: center; justify-content: center;
                font-size: 1.1rem;
                flex-shrink: 0;
                box-shadow: 0 0 10px rgba(99,102,241,0.5);
            }
            .danny-header-info { flex: 1; }
            .danny-header-info strong { color: #fff; font-size: 0.95rem; display: block; }
            .danny-status {
                font-size: 0.72rem;
                color: #4ade80;
                display: flex; align-items: center; gap: 4px;
            }
            .danny-status::before {
                content: '';
                width: 6px; height: 6px;
                border-radius: 50%;
                background: #4ade80;
                display: inline-block;
                animation: dannyBlink 1.5s ease-in-out infinite;
            }
            @keyframes dannyBlink {
                0%,100% { opacity: 1; } 50% { opacity: 0.3; }
            }
            #danny-close-btn {
                background: none; border: none; cursor: pointer;
                color: rgba(255,255,255,0.5); font-size: 1.1rem;
                line-height: 1; padding: 4px;
                transition: color 0.2s ease;
            }
            #danny-close-btn:hover { color: #fff; }

            /* Messages */
            #danny-messages {
                flex: 1;
                overflow-y: auto;
                padding: 1rem;
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                scrollbar-width: thin;
                scrollbar-color: rgba(99,102,241,0.3) transparent;
            }
            .danny-msg {
                max-width: 85%;
                padding: 0.6rem 0.85rem;
                border-radius: 12px;
                font-size: 0.85rem;
                line-height: 1.5;
                animation: dannyMsgIn 0.3s ease;
            }
            @keyframes dannyMsgIn {
                from { opacity: 0; transform: translateY(8px); }
                to   { opacity: 1; transform: translateY(0); }
            }
            .danny-msg.bot {
                background: rgba(99,102,241,0.18);
                border: 1px solid rgba(99,102,241,0.2);
                color: #e2e8f0;
                align-self: flex-start;
                border-bottom-left-radius: 4px;
            }
            .danny-msg.bot a { color: #a5b4fc; }
            .danny-msg.user {
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                color: #fff;
                align-self: flex-end;
                border-bottom-right-radius: 4px;
            }
            .danny-typing {
                display: flex; gap: 4px; align-items: center;
                padding: 0.5rem 0.85rem;
                background: rgba(99,102,241,0.12);
                border: 1px solid rgba(99,102,241,0.15);
                border-radius: 12px; border-bottom-left-radius: 4px;
                align-self: flex-start;
                width: fit-content;
            }
            .danny-typing span {
                width: 6px; height: 6px;
                background: #a5b4fc; border-radius: 50%;
                animation: dannyDot 1.2s ease-in-out infinite;
            }
            .danny-typing span:nth-child(2) { animation-delay: 0.2s; }
            .danny-typing span:nth-child(3) { animation-delay: 0.4s; }
            @keyframes dannyDot {
                0%,60%,100% { transform: translateY(0); opacity: 0.4; }
                30%          { transform: translateY(-5px); opacity: 1; }
            }

            /* Input */
            #danny-input-area {
                display: flex;
                gap: 0.5rem;
                padding: 0.75rem;
                border-top: 1px solid rgba(99,102,241,0.15);
                background: rgba(0,0,0,0.3);
            }
            #danny-input {
                flex: 1;
                background: rgba(255,255,255,0.07);
                border: 1px solid rgba(99,102,241,0.25);
                border-radius: 8px;
                color: #fff;
                padding: 0.5rem 0.75rem;
                font-size: 0.85rem;
                outline: none;
                transition: border-color 0.2s ease;
            }
            #danny-input::placeholder { color: rgba(255,255,255,0.3); }
            #danny-input:focus { border-color: rgba(99,102,241,0.6); }
            #danny-send-btn {
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                border: none; border-radius: 8px;
                width: 36px; height: 36px;
                cursor: pointer;
                display: flex; align-items: center; justify-content: center;
                transition: transform 0.2s ease, opacity 0.2s ease;
                flex-shrink: 0;
            }
            #danny-send-btn:hover { transform: scale(1.08); }
            #danny-send-btn svg { width: 16px; height: 16px; fill: #fff; }

            /* Notification badge */
            #danny-badge {
                position: absolute;
                top: -4px; right: -4px;
                width: 18px; height: 18px;
                background: #ef4444;
                border-radius: 50%;
                font-size: 0.65rem;
                color: #fff;
                display: flex; align-items: center; justify-content: center;
                font-weight: 700;
                border: 2px solid #000;
                opacity: 0;
                transform: scale(0);
                transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
            }
            #danny-badge.show { opacity: 1; transform: scale(1); }

            @media (max-width: 480px) {
                #danny-ai-window {
                    width: calc(100vw - 2rem);
                    left: 1rem;
                    bottom: 5rem;
                }
                #danny-ai-btn { bottom: 1.2rem; left: 1.2rem; }
            }
        `;
        document.head.appendChild(style);

        // ── Button ────────────────────────────────────────────────────────────
        const btn = document.createElement('button');
        btn.id = 'danny-ai-btn';
        btn.setAttribute('aria-label', 'Chat with Danny AI');
        btn.innerHTML = `
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.96 7.96 0 01-4.07-1.116l-.29-.173-3.005.894.894-3.005-.173-.29A7.96 7.96 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8zm4.406-5.845c-.242-.121-1.43-.705-1.652-.786-.222-.08-.383-.121-.544.121-.16.242-.623.786-.764.948-.14.161-.282.181-.523.06-.242-.12-1.02-.376-1.943-1.2-.718-.64-1.203-1.431-1.344-1.673-.14-.242-.015-.373.106-.493.108-.108.242-.282.363-.423.12-.141.16-.242.242-.403.08-.161.04-.302-.02-.423-.06-.12-.544-1.312-.745-1.796-.196-.472-.396-.408-.544-.416-.14-.007-.302-.009-.463-.009-.16 0-.423.06-.644.302-.222.242-.846.827-.846 2.017 0 1.19.866 2.34.987 2.502.12.161 1.703 2.6 4.126 3.645.577.249 1.027.397 1.378.508.579.184 1.106.158 1.522.096.464-.069 1.43-.585 1.632-1.15.2-.564.2-1.047.14-1.148-.06-.1-.222-.161-.463-.282z"/>
            </svg>
            <div id="danny-badge">1</div>
        `;
        document.body.appendChild(btn);

        // ── Chat window ───────────────────────────────────────────────────────
        const win = document.createElement('div');
        win.id = 'danny-ai-window';
        win.innerHTML = `
            <div id="danny-ai-header">
                <div class="danny-avatar">🤖</div>
                <div class="danny-header-info">
                    <strong>Danny AI</strong>
                    <span class="danny-status">Online</span>
                </div>
                <button id="danny-close-btn" aria-label="Close chat">✕</button>
            </div>
            <div id="danny-messages"></div>
            <div id="danny-input-area">
                <input id="danny-input" type="text" placeholder="Ask me anything…" autocomplete="off" />
                <button id="danny-send-btn" aria-label="Send">
                    <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </button>
            </div>
        `;
        document.body.appendChild(win);

        return { btn, win };
    }

    // ── Logic ─────────────────────────────────────────────────────────────────
    function init() {
        const { btn, win } = buildUI();
        const messages  = win.querySelector('#danny-messages');
        const input     = win.querySelector('#danny-input');
        const sendBtn   = win.querySelector('#danny-send-btn');
        const closeBtn  = win.querySelector('#danny-close-btn');
        const badge     = btn.querySelector('#danny-badge');
        let isOpen      = false;
        let greeted     = false;

        function addMsg(text, type) {
            const msg = document.createElement('div');
            msg.className = `danny-msg ${type}`;
            msg.innerHTML = text;
            messages.appendChild(msg);
            messages.scrollTop = messages.scrollHeight;
        }

        function showTyping() {
            const t = document.createElement('div');
            t.className = 'danny-typing';
            t.id = 'danny-typing-indicator';
            t.innerHTML = '<span></span><span></span><span></span>';
            messages.appendChild(t);
            messages.scrollTop = messages.scrollHeight;
        }

        function removeTyping() {
            const t = document.getElementById('danny-typing-indicator');
            if (t) t.remove();
        }

        function sendMessage() {
            const text = input.value.trim();
            if (!text) return;
            addMsg(text, 'user');
            input.value = '';
            showTyping();
            setTimeout(() => {
                removeTyping();
                addMsg(getReply(text), 'bot');
            }, 800 + Math.random() * 400);
        }

        function openChat() {
            isOpen = true;
            win.classList.add('open');
            badge.classList.remove('show');
            input.focus();
            if (!greeted) {
                greeted = true;
                setTimeout(() => {
                    addMsg("Hey! 👋 I'm <strong>Danny</strong>, Mugabi's AI assistant. Ask me about his skills, projects, experience or how to contact him!", 'bot');
                }, 300);
            }
        }

        function closeChat() {
            isOpen = false;
            win.classList.remove('open');
        }

        btn.addEventListener('click', () => isOpen ? closeChat() : openChat());
        closeBtn.addEventListener('click', closeChat);
        sendBtn.addEventListener('click', sendMessage);
        input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });

        // Show badge after 4 seconds to grab attention
        setTimeout(() => {
            if (!isOpen) badge.classList.add('show');
        }, 4000);
    }

    document.addEventListener('DOMContentLoaded', init);

})();
