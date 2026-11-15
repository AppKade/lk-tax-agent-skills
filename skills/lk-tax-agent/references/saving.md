# Save and resume procedure

The returned typed case is a plain JSON handoff containing confirmed aggregate facts and redacted source metadata. It has no consent, credentials, raw documents or worksheet approval. Retaining it in a conversation depends on the host; it is not a durable save and not necessarily private to the device.

For optional local encryption, have the operator configure a dedicated existing draft directory and a private 32-byte key file through secure local settings, using LK_TAX_DRAFT_ROOT and LK_TAX_DRAFT_KEY_FILE. Never put the key, key-file contents or ciphertext in a prompt, script arguments, logs or reports. Check capabilities and explain when configuration is missing. Do not make up a successful save.

Obtain explicit permission for the slot and action. Choose a one-through-thirty-day restore deadline and confirm overwrite of an existing draft separately. The helper uses authenticated encryption and rejects wrong keys, expiry, schema/rule mismatch and tampering. It saves facts and evidence metadata, not original records, consent or approvals. Explain the returned expiry is a restoration deadline; no cleanup scheduler deletes the file.

After restore, obtain current consent in the new conversation, show the restored totals and source decisions for review, ask about genuine changes and recompute. Require a fresh checklist for a worksheet. Preserve the existing case on a failed restore. Never treat a saved acknowledgement or a user-provided approval flag as current approval.

Deleting a slot removes that ciphertext file, without guaranteeing physical erasure or deleting backups, host chat, attachments or other copies. A user-requested plaintext export needs its own confidentiality explanation and file permission; it is not equivalent to the encrypted draft. Do not create either kind of persistent file unless the user asked.
