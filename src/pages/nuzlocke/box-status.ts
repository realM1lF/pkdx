/** i18n key for the box status chip. Duped is its own badge; the Missed filter still includes both. */
export function boxStatusBadgeKey(status: string): string {
  return status === 'duped' ? 'nuz.box.badge.duped' : 'nuz.box.badge.missed';
}
