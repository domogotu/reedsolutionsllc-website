# AI Automation Intake Operating System

This document defines the intake and tracking system for Reeds Solutions LLC AI Business Automation Services.

## Purpose

The intake system must collect enough information to file, scope, price, build, test, and support an automation request without repeated back-and-forth for basic missing details.

The core intake question is:

```text
Who wants what, why, how should it work, when is it needed, what systems are involved, what rules apply, and what result counts as done?
```

## Tailored Connection Rule

The customer should not be limited to a short list of apps. Intake must support known platforms, custom APIs, manual processes, documents, spreadsheets, databases, webhooks, and systems not yet listed. If a connection is not directly available, the request should still be captured and marked for review so Reeds Solutions can decide whether to use an API, webhook, email parsing, file import, spreadsheet bridge, manual approval step, or custom build path.

Never collect passwords through the website form. Access should be handled later through secure account authorization or owner-controlled credential setup.

## Public Service Categories

| Service | Primary Outcome | Typical Build |
|---|---|---|
| Starter Automation Setup | One focused workflow | Lead routing, email drafts, task follow-ups, spreadsheet/database logging |
| AI Email and Lead Response | Capture, classify, draft, approve, send/log replies | Website form/email intake, AI reply draft, owner approval, follow-up status |
| Store and Order Automation | Store task and support workflow organization | Customer support drafts, order issue triage, supplier/product tracking |
| Business Command Center | Connected multi-workflow operating layer | n8n, database, email, approval gates, monitoring, reporting |
| Ongoing Workflow Support | Keep workflows working and improving | Monitoring, fixes, prompt updates, status reviews, expansion |
| Custom Automation | Anything not listed | Review tools, process, API options, data flow, and owner approval requirements |

## Public Workflow Preview Rule

The website should visually show what customers receive without giving away the private product. Public examples may show:

- service level
- general price range
- business outcome
- simplified workflow stages
- approval and monitoring points
- customer deliverables

Public examples must not reveal:

- private prompts
- credentials or connection details
- exact n8n node settings
- database schemas
- internal routing logic
- customer-specific implementation recipes

The preferred website presentation is a swipeable card set moving from base to advanced:

```text
Base Build -> Growth Build -> Advanced Build -> Command Center
```

Each card should help a customer understand the difference in value, complexity, monitoring, and support level before they submit intake.

## Connection Categories

| Category | Examples | Intake Goal |
|---|---|---|
| Email and communication | Gmail, Outlook, Microsoft 365, website forms, SMS, chat, Slack, Teams, Discord | Know where messages come from and where replies should go |
| Stores and orders | Shopify, WooCommerce, WordPress, Square, Etsy, Amazon, eBay, custom storefronts | Know how orders, products, customers, returns, suppliers, and issues flow |
| CRM and sales | HubSpot, Salesforce, Zoho, Pipedrive, GoHighLevel, custom CRM | Know how leads are captured, qualified, followed up, and closed |
| Payments and billing | Stripe, Square, PayPal, QuickBooks, Wave, invoices | Know what can be monitored and what requires approval before billing action |
| Files and documents | Google Drive, Dropbox, OneDrive, Box, PDFs, spreadsheets, scanned docs | Know what files must be routed, summarized, named, checked, or stored |
| Scheduling and tasks | Google Calendar, Calendly, Trello, Asana, ClickUp, Monday, Notion, Airtable | Know due dates, reminders, appointments, task owners, and status rules |
| Data and reporting | Google Sheets, Excel, Airtable, PostgreSQL, dashboards, BI tools | Know where records live and what reporting is needed |
| Marketing and web | Mailchimp, social platforms, forms, landing pages, analytics | Know traffic sources, campaigns, inquiries, and customer touchpoints |
| Custom systems | APIs, webhooks, internal software, portals, manual workflows | Capture system names, available docs, login owner, data flow, and constraints |
| Unknown / not sure | Customer does not know the tool names | Capture screenshots, descriptions, links, and current manual steps later |

## Required Intake Fields

### Requester

- full_name
- email
- phone
- business_name
- requester_role
- decision_authority
- business_type_or_industry

### Request Definition

- primary_service
- main_goal
- current_process
- pain_points
- success_outcome
- desired_customer_or_staff_experience
- what_should_not_happen

### Service-Specific Details

For email and leads:

- lead_sources
- message_types
- response_rules
- escalation_rules
- reply_tone
- required_disclaimers
- follow_up_rules

For store/order support:

- store_platform
- store_domain
- marketplace_or_pos_system
- product_sources
- order_issue_types
- customer_support_needs
- supplier_workflow_needs
- refund_or_payment_rules
- publish_or_pricing_rules

For command center builds:

- departments_to_connect
- systems_to_connect
- reporting_needs
- user_roles
- approval_levels
- data_retention_needs
- workflow_failure_alerts

For custom automation:

- system_names
- links_or_vendor_names
- manual_steps_today
- files_or_templates_used
- available_api_or_export_options_if_known
- required approval points
- fallback process if a system cannot connect directly

### Tools and Access

- current_tools
- desired_connections
- other_systems_not_listed
- accounts_needed_later
- data_sensitivity
- login_owner
- integration_limitations
- file_or_template_locations

### Timing and Budget

- deadline
- budget_range
- support_needed_after_launch
- urgency_reason
- launch_dependencies

### Safety and Approval

- human_approval_required
- actions_allowed_without_approval
- actions_requiring_approval
- actions_never_allowed
- sensitive_data_categories
- customer_impacting_actions

## Lead Status Pipeline

```text
New
Needs Review
Missing Information
Qualified
Connection Review Needed
Not Qualified
Reply Drafted
Approved to Send
Sent
Discovery Scheduled
Proposal Needed
Proposal Sent
Won
Lost
Follow Up Needed
Closed
```

## Minimum Build File

Every accepted request should produce a build file with:

- intake_id
- lead_id
- service_category
- requester_summary
- business_summary
- workflow_goal
- current_process_summary
- required_integrations
- connection_path_direct_api_webhook_email_file_manual_or_custom
- approval_rules
- data_sensitivity
- implementation_scope
- exclusions
- risks
- open_questions
- estimated_phase
- quoted_price_or_range
- next_action

## Monitoring Requirements

The operating system should track:

- source_page
- traffic_source
- submission_time
- service_interest
- selected_connections
- unlisted_connections
- lead_status
- reply_status
- owner_approval_status
- last_contacted_at
- next_follow_up_at
- expected_value
- won_lost_reason
- workflow_failure_count after build
- support_plan status after build

## n8n Workflow Target

Future workflow route:

```text
Website Intake Form
-> n8n Webhook
-> Validate Required Fields
-> Normalize Intake Record
-> Classify Service Type
-> Classify Connection Categories
-> Score Completeness
-> Mark Missing Information or Connection Review Needed
-> Store Lead and Intake Record
-> Draft Owner Summary
-> Draft Customer Reply
-> Notify Dominique
-> Wait for Approval
-> Send Reply When Approved
-> Set Follow-Up Reminder
-> Update Status Log
```

## Reply Draft Rules

AI may draft replies that:

- acknowledge the request
- summarize what the requester asked for
- list any missing information
- identify connection categories involved
- flag any custom connection review needed
- recommend a discovery call or next step
- avoid guaranteeing results
- avoid legal, accounting, medical, or regulated advice
- avoid promising fully autonomous operation
- keep owner approval before sending

## Information Quality Rule

If the intake is incomplete, the system should not guess. It should mark the request as `Missing Information` and generate a targeted follow-up asking only for the missing fields needed to scope the service.

If the requested system is not recognized, the system should not reject it. It should mark the request as `Connection Review Needed` and ask for the system name, link, screenshots if appropriate, current manual steps, and whether the platform has API, webhook, export, or email notification options.

## First Implementation Stage

The first live implementation can use the static `ai-automation.html` page to generate a structured email. The next stage should connect the form to an n8n webhook and a database table so Reeds Solutions can monitor traffic, leads, requests, replies, orders where applicable, and follow-ups.
