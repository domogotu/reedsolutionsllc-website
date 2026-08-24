# AI Automation Intake Operating System

This document defines the intake and tracking system for Reeds Solutions LLC AI Business Automation Services.

## Purpose

The intake system must collect enough information to file, scope, price, build, test, and support an automation request without repeated back-and-forth for basic missing details.

The core intake question is:

```text
Who wants what, why, how should it work, when is it needed, what systems are involved, what rules apply, and what result counts as done?
```

## Public Service Categories

| Service | Primary Outcome | Typical Build |
|---|---|---|
| Starter Automation Setup | One focused workflow | Lead routing, email drafts, task follow-ups, spreadsheet/database logging |
| AI Email and Lead Response | Capture, classify, draft, approve, send/log replies | Website form/email intake, AI reply draft, owner approval, follow-up status |
| Shopify Automation Support | Store task and support workflow organization | Customer support drafts, order issue triage, supplier/product tracking |
| Business Command Center | Connected multi-workflow operating layer | n8n, database, email, approval gates, monitoring, reporting |
| Ongoing Workflow Support | Keep workflows working and improving | Monitoring, fixes, prompt updates, status reviews, expansion |

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

For Shopify/store support:

- store_platform
- store_domain
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

### Tools and Access

- current_tools
- accounts_needed_later
- data_sensitivity
- login_owner
- integration_limitations
- file_or_template_locations

Never collect passwords through the website form. Access should be handled later through secure account authorization or owner-controlled credential setup.

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
-> Score Completeness
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
- recommend a discovery call or next step
- avoid guaranteeing results
- avoid legal, accounting, medical, or regulated advice
- avoid promising fully autonomous operation
- keep owner approval before sending

## Information Quality Rule

If the intake is incomplete, the system should not guess. It should mark the request as `Missing Information` and generate a targeted follow-up asking only for the missing fields needed to scope the service.

## First Implementation Stage

The first live implementation can use the static `ai-automation.html` page to generate a structured email. The next stage should connect the form to an n8n webhook and a database table so Reeds Solutions can monitor traffic, leads, requests, replies, orders where applicable, and follow-ups.
