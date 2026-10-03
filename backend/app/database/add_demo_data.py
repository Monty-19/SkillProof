import json
import logging
from datetime import datetime, timedelta
from app.database.database import SessionLocal, engine, Base
from app.core.security import get_password_hash
from app.models.user import User
from app.models.skill import Skill
from app.models.challenge import Challenge
from app.models.submission import Submission
from app.models.evaluation import Evaluation
from app.models.skill_evidence import SkillEvidence
from app.models.project import Project
from app.models.badge import Badge, StudentBadge
from app.models.notification import Notification

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def add_demo_data():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        default_pw = get_password_hash("password123")

        # 1. NEW SKILLS
        new_skills = [
            ("skill-cybersecurity", "Cybersecurity", "Security", "Threat modeling, OWASP Top 10, penetration testing, security auditing", "shield-check"),
            ("skill-appsec", "Application Security", "Security", "JWT verification, CSRF/XSS prevention, input sanitization, vulnerability patching", "shield-alert"),
            ("skill-data-viz", "Data Visualization", "Data", "Tableau, PowerBI, Matplotlib, Seaborn, D3.js dashboarding", "bar-chart")
        ]
        for sid, name, cat, desc, icon in new_skills:
            if not db.query(Skill).filter(Skill.id == sid).first():
                db.add(Skill(id=sid, name=name, category=cat, description=desc, icon=icon))
        db.commit()

        # 2. NEW CHALLENGES
        new_challenges = [
            {
                "id": "chal-sales-dashboard-analysis",
                "title": "Build an Executive Sales Analytics Dashboard",
                "description": "Analyze multi-region sales datasets with SQL & Python, calculate churn rate, cohort retention, and visualize revenue anomalies with predictive metrics.",
                "scenario": "A fast-scaling B2B marketplace needs an executive analytics pipeline that cleans messy transaction logs, computes quarterly customer metrics, and highlights margin risks.",
                "difficulty": "INTERMEDIATE",
                "category": "Data",
                "estimated_minutes": 60,
                "skill_id": "skill-data-analysis",
                "instructions": "1. Ingest multi-currency sales datasets and normalize exchange rates.\n2. Write SQL CTEs for quarterly cohort retention.\n3. Build visualization charts showing margin compression.\n4. Deliver an executive summary report with actionable recommendations.",
                "requirements": [
                    "Multi-table SQL joins and window partition calculations",
                    "Python/Pandas data cleaning pipeline with missing value imputation",
                    "Cohort retention heatmap and revenue trend analysis",
                    "Automated data sanity checks and margin leak alerts"
                ],
                "evaluation_criteria": [
                    "Functionality: Accurate analytical metrics and retention matrix (25 pts)",
                    "Insight Quality: Actionable business takeaways and statistical depth (25 pts)",
                    "Data Integrity: Outlier sanitization and currency precision (20 pts)",
                    "Code Quality: Modular Pandas scripts and well-formatted SQL (20 pts)",
                    "Visualization: Clear, uncluttered visual hierarchy (10 pts)"
                ]
            },
            {
                "id": "chal-security-audit-auth",
                "title": "Vulnerability Assessment & Hardening for Auth Service",
                "description": "Conduct an in-depth penetration test and security audit on an authentication microservice, patch OWASP Top 10 vulnerabilities, and enforce zero-trust token verification.",
                "scenario": "A health-tech platform handles sensitive patient data. Before compliance certification, you must audit the JWT login pipeline, mitigate timing attacks, and eliminate SQL injection.",
                "difficulty": "ADVANCED",
                "category": "Security",
                "estimated_minutes": 75,
                "skill_id": "skill-cybersecurity",
                "instructions": "1. Audit endpoints for IDOR (Insecure Direct Object Reference) and broken object-level auth.\n2. Remediate SQL injection and weak password hashing algorithms.\n3. Harden JWT verification with asymmetric RSA keys and algorithm pinning.\n4. Implement sliding-window rate limiting and secure HTTP headers (CSP, HSTS).",
                "requirements": [
                    "Detailed penetration test audit report with CVE classifications",
                    "Patched authentication service preventing token replay and timing attacks",
                    "Automated security regression tests verifying input sanitization",
                    "Enforced OWASP security headers (Content-Security-Policy, Strict-Transport-Security)"
                ],
                "evaluation_criteria": [
                    "Vulnerability Remediation: Complete mitigation of identified flaws (25 pts)",
                    "Cryptographic Rigor: Secure key handling and constant-time comparisons (25 pts)",
                    "Defensive Engineering: Defense-in-depth, rate limiting, and sanitization (20 pts)",
                    "Code Quality: Idiomatic, clean security middleware (20 pts)",
                    "Audit Documentation: Thorough threat modeling and remediation notes (10 pts)"
                ]
            },
            {
                "id": "chal-fullstack-crm",
                "title": "Build a Multi-Tenant SaaS CRM Platform",
                "description": "Engineer a full-stack, multi-tenant customer relationship platform with React, TypeScript, Node.js REST API, real-time pipeline status, and role-based access control.",
                "scenario": "A venture studio needs an agile, high-performance CRM tailored for sales engineering teams with instant pipeline updates and audit logs.",
                "difficulty": "ADVANCED",
                "category": "Frontend Development",
                "estimated_minutes": 90,
                "skill_id": "skill-react",
                "instructions": "1. Build a responsive kanban deal pipeline with drag-and-drop mechanics.\n2. Implement a secure REST API with JWT auth and tenant isolation.\n3. Add optimistic UI updates and real-time state synchronization.\n4. Ensure 95+ Lighthouse accessibility and performance ratings.",
                "requirements": [
                    "Interactive Kanban board with drag-and-drop deal progression",
                    "Full-stack REST API with PostgreSQL/SQLite persistence",
                    "Role-based authorization and tenant data isolation",
                    "Comprehensive unit and integration test coverage"
                ],
                "evaluation_criteria": [
                    "Functionality: Seamless drag-and-drop and robust state sync (25 pts)",
                    "Architecture: Clean separation of concerns and type-safe API contracts (25 pts)",
                    "UI/UX Polish: Fluid transitions, micro-interactions, and dark mode (20 pts)",
                    "Code Quality: Modular React hooks and documented endpoints (20 pts)",
                    "Accessibility: Full keyboard tab order and screen reader semantics (10 pts)"
                ]
            }
        ]

        for cd in new_challenges:
            if not db.query(Challenge).filter(Challenge.id == cd["id"]).first():
                c = Challenge(
                    id=cd["id"],
                    title=cd["title"],
                    description=cd["description"],
                    scenario=cd["scenario"],
                    difficulty=cd["difficulty"],
                    category=cd["category"],
                    estimated_minutes=cd["estimated_minutes"],
                    skill_id=cd["skill_id"],
                    instructions=cd["instructions"],
                    requirements=json.dumps(cd["requirements"]),
                    evaluation_criteria=json.dumps(cd["evaluation_criteria"])
                )
                db.add(c)
        db.commit()

        # 3. USERS TO ADD / UPDATE
        # User: Manthan Choudhary (User login)
        manthan = db.query(User).filter(User.email == "manthan.c0588@gmail.com").first()
        if not manthan:
            manthan = User(
                id="user-student-manthan",
                name="Manthan Choudhary",
                username="manthan_c",
                email="manthan.c0588@gmail.com",
                password_hash=default_pw,
                role="STUDENT",
                avatar="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
                headline="Lead Full Stack Engineer & Product Architect",
                bio="Building high-performance distributed systems, real-time developer platforms, and verified skill credentialing engines. Obsessed with clean architecture and practical code execution.",
                college="Pune Institute of Computer Technology (PICT)",
                location="Pune, India",
                github_url="https://github.com/manthan-c0588",
                linkedin_url="https://linkedin.com/in/manthan-chavan"
            )
            db.add(manthan)
            db.commit()

        # User: Yash Pimpalkar (Full Stack Web App Developer)
        yash = db.query(User).filter(User.email == "yash.pimpalkar@skillproof.dev").first()
        if not yash:
            yash = User(
                id="user-student-yash",
                name="Yash Pimpalkar",
                username="yash_p",
                email="yash.pimpalkar@skillproof.dev",
                password_hash=default_pw,
                role="STUDENT",
                avatar="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
                headline="Full Stack Web App Developer",
                bio="Specializing in scalable full-stack web applications with React, TypeScript, Node.js, and distributed microservices. High focus on Lighthouse 95+ performance, clean system design, and automated test pipelines.",
                college="Pune Institute of Computer Technology (PICT)",
                location="Pune, India",
                github_url="https://github.com/yash-pimpalkar",
                linkedin_url="https://linkedin.com/in/yash-pimpalkar"
            )
            db.add(yash)
            db.commit()

        # User: Purva Mahajan (Data Analyst)
        purva = db.query(User).filter(User.email == "purva.mahajan@skillproof.dev").first()
        if not purva:
            purva = User(
                id="user-student-purva",
                name="Purva Mahajan",
                username="purva_m",
                email="purva.mahajan@skillproof.dev",
                password_hash=default_pw,
                role="STUDENT",
                avatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
                headline="Data Analyst & Business Intelligence Specialist",
                bio="Transforming large-scale transaction databases into actionable executive dashboards, customer retention models, and predictive growth forecasts. Expert in SQL, Python, Pandas, and analytical modeling.",
                college="Symbiosis Institute of Technology",
                location="Mumbai, India",
                github_url="https://github.com/purva-mahajan",
                linkedin_url="https://linkedin.com/in/purva-mahajan"
            )
            db.add(purva)
            db.commit()

        # User: Sanika Barhate (Cybersecurity Analyst)
        sanika = db.query(User).filter(User.email == "sanika.barhate@skillproof.dev").first()
        if not sanika:
            sanika = User(
                id="user-student-sanika",
                name="Sanika Barhate",
                username="sanika_b",
                email="sanika.barhate@skillproof.dev",
                password_hash=default_pw,
                role="STUDENT",
                avatar="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
                headline="Cybersecurity Analyst & Threat Intelligence Specialist",
                bio="Focused on penetration testing, OWASP Top 10 threat mitigation, zero-trust network policies, and API security auditing. Proven track record in hardening authentication services and secure code reviews.",
                college="College of Engineering, Pune (COEP)",
                location="Pune, India",
                github_url="https://github.com/sanika-barhate",
                linkedin_url="https://linkedin.com/in/sanika-barhate"
            )
            db.add(sanika)
            db.commit()

        # NEW RECRUITERS
        recruiters_to_add = [
            ("user-recruiter-rajesh", "Rajesh Singhania", "rajesh_s", "rajesh.singhania@techcorp.com", "Head of Engineering Talent @ Stripe / FinTech Labs", "Bangalore, India", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"),
            ("user-recruiter-sarah", "Sarah Jenkins", "sarah_j", "sarah.jenkins@cloudscale.io", "VP of Technical Recruiting @ CloudScale AI", "San Francisco, USA", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"),
            ("user-recruiter-vikram", "Vikram Malhotra", "vikram_m", "vikram.malhotra@cyberdefense.com", "Principal Cyber & Security Talent Partner @ DefendNet Global", "London, UK", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80")
        ]
        for rid, rname, ruser, remail, rhead, rloc, ravatar in recruiters_to_add:
            if not db.query(User).filter(User.email == remail).first():
                rec = User(
                    id=rid,
                    name=rname,
                    username=ruser,
                    email=remail,
                    password_hash=default_pw,
                    role="RECRUITER",
                    avatar=ravatar,
                    headline=rhead,
                    location=rloc
                )
                db.add(rec)
        db.commit()

        # 4. SKILL EVIDENCE (HIGH SCORES)
        # Yash Pimpalkar: Full Stack Web App Developer
        yash_evidences = [
            ("skill-react", 94, 4, 3),
            ("skill-js", 92, 3, 2),
            ("skill-ts", 91, 3, 2),
            ("skill-node", 90, 3, 2),
            ("skill-html-css", 93, 2, 2)
        ]
        for skid, sc, cc, pc in yash_evidences:
            existing = db.query(SkillEvidence).filter(SkillEvidence.student_id == yash.id, SkillEvidence.skill_id == skid).first()
            if not existing:
                db.add(SkillEvidence(
                    student_id=yash.id,
                    skill_id=skid,
                    score=sc,
                    demonstrated=True,
                    challenge_count=cc,
                    project_count=pc,
                    verified_at=datetime.utcnow() - timedelta(days=2)
                ))

        # Purva Mahajan: Data Analyst
        purva_evidences = [
            ("skill-data-analysis", 95, 4, 3),
            ("skill-sql", 93, 4, 2),
            ("skill-python", 91, 3, 2),
            ("skill-data-viz", 94, 2, 2)
        ]
        for skid, sc, cc, pc in purva_evidences:
            existing = db.query(SkillEvidence).filter(SkillEvidence.student_id == purva.id, SkillEvidence.skill_id == skid).first()
            if not existing:
                db.add(SkillEvidence(
                    student_id=purva.id,
                    skill_id=skid,
                    score=sc,
                    demonstrated=True,
                    challenge_count=cc,
                    project_count=pc,
                    verified_at=datetime.utcnow() - timedelta(days=3)
                ))

        # Sanika Barhate: Cybersecurity Analyst
        sanika_evidences = [
            ("skill-cybersecurity", 96, 4, 3),
            ("skill-appsec", 94, 3, 2),
            ("skill-rest", 92, 3, 2),
            ("skill-python", 90, 2, 1)
        ]
        for skid, sc, cc, pc in sanika_evidences:
            existing = db.query(SkillEvidence).filter(SkillEvidence.student_id == sanika.id, SkillEvidence.skill_id == skid).first()
            if not existing:
                db.add(SkillEvidence(
                    student_id=sanika.id,
                    skill_id=skid,
                    score=sc,
                    demonstrated=True,
                    challenge_count=cc,
                    project_count=pc,
                    verified_at=datetime.utcnow() - timedelta(days=1)
                ))

        # Manthan Chavan: Lead Full Stack Engineer
        manthan_evidences = [
            ("skill-js", 96, 5, 4),
            ("skill-react", 95, 4, 3),
            ("skill-node", 93, 4, 3),
            ("skill-python", 94, 3, 2),
            ("skill-sql", 92, 3, 2),
            ("skill-docker", 90, 2, 2)
        ]
        for skid, sc, cc, pc in manthan_evidences:
            existing = db.query(SkillEvidence).filter(SkillEvidence.student_id == manthan.id, SkillEvidence.skill_id == skid).first()
            if not existing:
                db.add(SkillEvidence(
                    student_id=manthan.id,
                    skill_id=skid,
                    score=sc,
                    demonstrated=True,
                    challenge_count=cc,
                    project_count=pc,
                    verified_at=datetime.utcnow() - timedelta(days=1)
                ))
        db.commit()

        # 5. SUBMISSIONS & EVALUATIONS
        # Yash Pimpalkar: Canvas & Fullstack CRM
        if not db.query(Submission).filter(Submission.student_id == yash.id).first():
            sub_y1 = Submission(
                id="sub-yash-1",
                student_id=yash.id,
                challenge_id="chal-react-canvas",
                github_url="https://github.com/yash-pimpalkar/collaborative-canvas-pro",
                live_demo_url="https://canvas.yash.dev",
                explanation="Built using custom HTML5 Canvas render pipeline decoupled from React component state trees to guarantee a rock-solid 60 FPS under intensive brush strokes. Implemented immutable Redux undo/redo history and WebSocket room broadcasts.",
                status="EVALUATED",
                score=94,
                submitted_at=datetime.utcnow() - timedelta(days=2)
            )
            db.add(sub_y1)
            db.commit()

            eval_y1 = Evaluation(
                id="eval-yash-1",
                submission_id=sub_y1.id,
                functionality_score=24,
                uiux_score=24,
                responsiveness_score=19,
                code_quality_score=19,
                accessibility_score=8,
                total_score=94,
                ai_feedback="Exceptional engineering demonstrated on 'Build a Real-Time Collaborative Canvas'. The decoupled rendering architecture prevents jank and maintains 60fps effortlessly. Implements comprehensive undo/redo state stacks.",
                strengths=json.dumps([
                    "Decoupled requestAnimationFrame canvas engine prevents React render bottlenecks",
                    "Robust immutable state stack supporting deep undo/redo histories",
                    "Clean TypeScript interfaces with zero 'any' fallbacks",
                    "Intuitive floating toolbar with keyboard shortcut accelerators"
                ]),
                weaknesses=json.dumps([
                    "Pinch-to-zoom touch gesture acceleration could be further smoothed on older mobile chipsets"
                ]),
                recommendations=json.dumps([
                    "Add export as SVG vector path in addition to current PNG canvas export",
                    "Consider WebGL shader acceleration for particle brush effects"
                ]),
                evaluation_provider="ai",
                created_at=datetime.utcnow() - timedelta(days=2)
            )
            db.add(eval_y1)
            db.commit()

        # Purva Mahajan: Sales Dashboard & Customer Dataset
        if not db.query(Submission).filter(Submission.student_id == purva.id).first():
            sub_p1 = Submission(
                id="sub-purva-1",
                student_id=purva.id,
                challenge_id="chal-sales-dashboard-analysis",
                github_url="https://github.com/purva-mahajan/executive-sales-analytics",
                live_demo_url="https://analytics.purva.dev",
                explanation="Engineered an executive sales analytics pipeline with automated ETL scripts in Python and complex SQL window functions. Computed rolling 30-day cohort retention, customer lifetime value (LTV), and multi-currency exchange adjustments with margin alerts.",
                status="EVALUATED",
                score=95,
                submitted_at=datetime.utcnow() - timedelta(days=3)
            )
            db.add(sub_p1)
            db.commit()

            eval_p1 = Evaluation(
                id="eval-purva-1",
                submission_id=sub_p1.id,
                functionality_score=25,
                uiux_score=24,
                responsiveness_score=19,
                code_quality_score=19,
                accessibility_score=8,
                total_score=95,
                ai_feedback="Outstanding analytical solution for 'Build an Executive Sales Analytics Dashboard'. SQL CTEs and cohort retention matrices are production-grade. Visual representations communicate margin compression with executive clarity.",
                strengths=json.dumps([
                    "Flawless window partition SQL queries computing cohort retention with zero anomalies",
                    "Vectorized Pandas data transformations executing 12x faster than iterative loops",
                    "Executive visual hierarchy highlighting immediate revenue leakage alerts",
                    "Automated data sanity validation pipeline checking currency rounding integrity"
                ]),
                weaknesses=json.dumps([
                    "Could include interactive scenario-modeling slider for simulated price elasticity"
                ]),
                recommendations=json.dumps([
                    "Package recurring analytical scripts into an automated dbt / Airflow DAG model",
                    "Incorporate predictive ARIMA time-series forecast for upcoming quarter revenue"
                ]),
                evaluation_provider="ai",
                created_at=datetime.utcnow() - timedelta(days=3)
            )
            db.add(eval_p1)
            db.commit()

        # Sanika Barhate: Security Audit Auth
        if not db.query(Submission).filter(Submission.student_id == sanika.id).first():
            sub_s1 = Submission(
                id="sub-sanika-1",
                student_id=sanika.id,
                challenge_id="chal-security-audit-auth",
                github_url="https://github.com/sanika-barhate/zero-trust-auth-hardened",
                live_demo_url="https://auth-sec.sanika.dev",
                explanation="Executed comprehensive penetration testing against the authentication service. Identified and patched critical IDOR flaws, converted symmetric JWT keys to RS256 asymmetric signatures with key rotation, added argon2id password hashing, and integrated Redis sliding-window IP rate limiting.",
                status="EVALUATED",
                score=96,
                submitted_at=datetime.utcnow() - timedelta(days=1)
            )
            db.add(sub_s1)
            db.commit()

            eval_s1 = Evaluation(
                id="eval-sanika-1",
                submission_id=sub_s1.id,
                functionality_score=25,
                uiux_score=23,
                responsiveness_score=19,
                code_quality_score=20,
                accessibility_score=9,
                total_score=96,
                ai_feedback="Exemplary submission for 'Vulnerability Assessment & Hardening for Auth Service'. Demonstrates rigorous zero-trust security engineering, cryptographic key isolation, and defensive middleware architecture.",
                strengths=json.dumps([
                    "Rigorous remediation of IDOR and token replay vulnerabilities",
                    "Asymmetric RS256 JWT implementation with constant-time token comparison",
                    "Sliding-window Redis rate limiting preventing credential stuffing attacks",
                    "Comprehensive automated security regression test suite with 100% exploit coverage"
                ]),
                weaknesses=json.dumps([
                    "Could add automated SIEM audit webhook logging for failed authentication bursts"
                ]),
                recommendations=json.dumps([
                    "Integrate WebAuthn / FIDO2 hardware passkey authentication",
                    "Enforce mTLS (mutual TLS) for internal service-to-service communication"
                ]),
                evaluation_provider="ai",
                created_at=datetime.utcnow() - timedelta(days=1)
            )
            db.add(eval_s1)
            db.commit()

        # Manthan Chavan: Full Stack CRM
        if not db.query(Submission).filter(Submission.student_id == manthan.id).first():
            sub_m1 = Submission(
                id="sub-manthan-1",
                student_id=manthan.id,
                challenge_id="chal-fullstack-crm",
                github_url="https://github.com/manthan-c0588/enterprise-saas-crm",
                live_demo_url="https://crm.manthan.dev",
                explanation="Built a production-grade multi-tenant SaaS CRM platform featuring an intuitive drag-and-drop Kanban pipeline, optimistic UI updates, role-based JWT authentication, and isolated tenant schemas.",
                status="EVALUATED",
                score=96,
                submitted_at=datetime.utcnow() - timedelta(days=1)
            )
            db.add(sub_m1)
            db.commit()

            eval_m1 = Evaluation(
                id="eval-manthan-1",
                submission_id=sub_m1.id,
                functionality_score=25,
                uiux_score=25,
                responsiveness_score=19,
                code_quality_score=19,
                accessibility_score=8,
                total_score=96,
                ai_feedback="Exceptional full-stack architecture on 'Build a Multi-Tenant SaaS CRM Platform'. Demonstrates mastery of reactive state management, seamless drag-and-drop mechanics, and secure multitenant database isolation.",
                strengths=json.dumps([
                    "High-performance drag-and-drop Kanban pipeline with zero layout shift",
                    "Optimistic UI updates with automatic conflict rollback mechanisms",
                    "Robust tenant data isolation and strict role-based access control",
                    "Flawless Lighthouse performance rating of 98/100"
                ]),
                weaknesses=json.dumps([
                    "Keyboard drag-and-drop accessibility can be supplemented with ARIA-grabbed announcements"
                ]),
                recommendations=json.dumps([
                    "Add automated webhook delivery for external third-party integrations",
                    "Implement GraphQL query layer for customized reporting fields"
                ]),
                evaluation_provider="ai",
                created_at=datetime.utcnow() - timedelta(days=1)
            )
            db.add(eval_m1)
            db.commit()

        # 6. PROJECTS FOR NEW CANDIDATES
        projects_to_add = [
            # Yash
            (yash.id, "Enterprise SaaS CRM Platform", "Multi-tenant CRM with Kanban deal progression, real-time activity feeds, and tenant isolation.", "https://github.com/yash-pimpalkar/enterprise-crm", "https://crm.yash.dev", "React 19, TypeScript, Node.js, PostgreSQL, Tailwind CSS"),
            (yash.id, "Realtime Collaborative Whiteboard", "Interactive 60fps canvas with freehand shapes, undo/redo history stack, and WebSockets.", "https://github.com/yash-pimpalkar/collaborative-canvas", "https://canvas.yash.dev", "HTML5 Canvas, React, TypeScript, WebSockets"),
            # Purva
            (purva.id, "Omnichannel Retail Cohort & LTV Forecasting", "Data analytics pipeline tracking 12-month cohort retention, customer acquisition costs, and predictive LTV.", "https://github.com/purva-mahajan/retail-cohort-analytics", "https://cohort.purva.dev", "Python, Pandas, SQL, Plotly, FastAPI"),
            (purva.id, "Realtime Financial Fraud Detection Engine", "Stream processing pipeline flagging anomalous transactions with unsupervised isolation forests.", "https://github.com/purva-mahajan/fraud-detection-engine", "https://fraud.purva.dev", "Python, Scikit-Learn, SQL, Streamlit"),
            # Sanika
            (sanika.id, "Automated Web Application Vulnerability Scanner", "Automated OWASP Top 10 scanner detecting XSS, SQLi, and misconfigured CORS headers with PDF audit reports.", "https://github.com/sanika-barhate/web-vuln-scanner", "https://scanner.sanika.dev", "Python, Cryptography, OWASP ZAP API, FastAPI"),
            (sanika.id, "Zero-Trust JWT Cryptographic Token Verifier", "High-throughput token validation gateway with RS256 signature rotation and sliding-window rate limiting.", "https://github.com/sanika-barhate/zero-trust-token-gateway", "https://auth-gateway.sanika.dev", "Python, Redis, Docker, Cryptography"),
            # Manthan
            (manthan.id, "SkillProof Proof-of-Skill Platform", "Decoupled verification platform evaluating practical coding challenges with Google Gemini AI.", "https://github.com/manthan-c0588/skillproof-platform", "https://skillproof.manthan.dev", "React 19, TypeScript, FastAPI, Google Gemini API, SQLAlchemy"),
            (manthan.id, "Distributed Event Bus & Task Orchestrator", "Resilient pub/sub event mesh with dead-letter queue retries and real-time observability telemetry.", "https://github.com/manthan-c0588/distributed-event-bus", "https://events.manthan.dev", "Python, Redis, Docker, PostgreSQL")
        ]

        for st_id, ptitle, pdesc, pgit, pdemo, ptech in projects_to_add:
            if not db.query(Project).filter(Project.student_id == st_id, Project.title == ptitle).first():
                db.add(Project(
                    student_id=st_id,
                    title=ptitle,
                    description=pdesc,
                    github_url=pgit,
                    live_demo_url=pdemo,
                    technologies=ptech
                ))
        db.commit()

        # 7. BADGES FOR NEW CANDIDATES
        badges_map = [
            (yash.id, ["badge-first-proof", "badge-problem-solver", "badge-frontend-verified", "badge-clean-code", "badge-multi-skilled"]),
            (purva.id, ["badge-first-proof", "badge-problem-solver", "badge-clean-code", "badge-multi-skilled"]),
            (sanika.id, ["badge-first-proof", "badge-problem-solver", "badge-clean-code", "badge-frontend-verified"]),
            (manthan.id, ["badge-first-proof", "badge-problem-solver", "badge-frontend-verified", "badge-clean-code", "badge-multi-skilled"])
        ]
        for st_id, badge_list in badges_map:
            for bid in badge_list:
                if not db.query(StudentBadge).filter(StudentBadge.student_id == st_id, StudentBadge.badge_id == bid).first():
                    db.add(StudentBadge(student_id=st_id, badge_id=bid))
        db.commit()

        # 8. NOTIFICATIONS FOR NEW STUDENTS
        notifications_to_add = [
            (yash.id, "Verified Full Stack Proof", "Your submission for 'Build a Real-Time Collaborative Canvas' achieved a 94/100 verified score!"),
            (purva.id, "Verified Data Proof", "Your submission for 'Build an Executive Sales Analytics Dashboard' scored 95/100!"),
            (sanika.id, "Verified Cybersecurity Proof", "Your submission for 'Vulnerability Assessment & Hardening for Auth Service' scored 96/100!"),
            (manthan.id, "Verified Full Stack Architecture", "Your submission for 'Build a Multi-Tenant SaaS CRM Platform' scored 96/100!")
        ]
        for st_id, ntitle, nmsg in notifications_to_add:
            if not db.query(Notification).filter(Notification.user_id == st_id, Notification.title == ntitle).first():
                db.add(Notification(
                    user_id=st_id,
                    title=ntitle,
                    message=nmsg,
                    type="EVALUATION",
                    read=False
                ))
        db.commit()

        logger.info("New candidates, skills, challenges, and recruiters successfully populated!")
    except Exception as e:
        db.rollback()
        logger.error(f"Error adding demo data: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    add_demo_data()
