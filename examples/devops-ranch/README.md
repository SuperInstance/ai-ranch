# DevOps Ranch Example

A monitoring and automation configuration for DevOps teams.

## 🎯 Use Case

Perfect for:
- Infrastructure monitoring
- Incident response
- CI/CD automation
- Log analysis

## 📁 Configuration

### Active Species

| Species | Role | Priority |
|---------|------|----------|
| Chicken | Monitoring | Primary |
| Hog | Diagnostics | Primary |
| Duck | API integrations | Secondary |
| Falcon | Quick searches | Secondary |

### Setup

```bash
# Copy breeds
cp -r breeds/ /path/to/ai-ranch/templates/

# Configure webhooks
# Add your monitoring endpoints to config/webhooks.json

# Start ranch
bun run dev
```

## 🔧 Alert Configuration

### Critical Alerts (Chicken)
```markdown
# constraints
- required: Alert immediately on critical issues
- required: Include runbook links
- forbidden: Never suppress critical alerts
```

### Log Analysis (Hog)
```markdown
# capabilities
- log_analysis (weight: 1.0)
- pattern_detection (weight: 0.95)
- anomaly_detection (weight: 0.9)
```

## 📊 Integration Points

| System | Integration |
|--------|-------------|
| Prometheus | Metrics collection |
| Grafana | Dashboard updates |
| PagerDuty | Alert routing |
| Slack | Notifications |

## 🚀 Automation Workflows

1. **Alert Received**: Chicken routes to appropriate team
2. **Diagnostics**: Hog analyzes logs and metrics
3. **Resolution**: Duck executes remediation APIs
4. **Documentation**: Falcon updates runbooks
