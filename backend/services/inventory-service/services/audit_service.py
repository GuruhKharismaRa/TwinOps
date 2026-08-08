from models.audit_log import AuditLog

def create_audit_log(
    db,
    event_type,
    module,
    action,
    entity_type,
    entity_id,
    entity_code,
    performed_by,
    request_id=None,
    trace_id=None,
    session_id=None,
    ip_address=None,
    user_agent=None,
    device_info=None,
    old_value=None,
    new_value=None,
    remarks=None,
    severity="INFO",
    status="SUCCESS",
    tenant_id=None,
    user_role=None
):

    audit = AuditLog(
        event_type=event_type,
        module=module,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        entity_code=entity_code,
        performed_by=performed_by,
        request_id=request_id,
        trace_id=trace_id,
        session_id=session_id,
        ip_address=ip_address,
        user_agent=user_agent,
        device_info=device_info,
        old_value=old_value,
        new_value=new_value,
        remarks=remarks,
        severity=severity,
        status=status,
        tenant_id=tenant_id,
        user_role=user_role
    )

    db.add(audit)

    db.commit()