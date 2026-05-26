/** account_id продавца в contract.yookassa (в UI — «ShopId») */
export function getYookassaAccountId(contract) {
  if (!contract) return ''
  const y = contract.yookassa
  return String(
    y?.account_id ||
    y?.accountId ||
    y?.shopId ||
    contract.yookassaAccountId ||
    ''
  ).trim()
}

export function hasYookassaAccountId(contract) {
  return !!getYookassaAccountId(contract)
}
