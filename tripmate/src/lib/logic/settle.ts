/*
This file implements logics for group settlements.
*/

interface Transaction {
  amount: number;
  paidByUserId: string;
}

export interface MemberBalance {
    userId: string;
    balance: number; // positive = owed, negative = owes
  }
  
  export interface Settlement {
    from: string;
    to: string;
    amount: number;
  }

  
/*
This function accept a list of transactions and a list of members,
then convert them in to a list of MemberBlances
by calculating the mean expense, and deduct which from each members' paid amount
*/
export function prepareSettlement(
  transactions: Transaction[],
  members: string[] // user IDs
): {
  total: number;
  mean: number;
  balances: MemberBalance[];
  settlements: Settlement[];
} {
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  const mean = total / members.length;

  const paidMap = new Map<string, number>();
  for (const t of transactions) {
    paidMap.set(t.paidByUserId, (paidMap.get(t.paidByUserId) ?? 0) + t.amount);
  }

  const balances: MemberBalance[] = members.map((userId) => ({
    userId,
    balance: (paidMap.get(userId) ?? 0) - mean,
  }));

  const settlements = settleDebts(balances);

  return { total, mean, balances, settlements };
}

/*
Greedy algorithm to minimize number of transactions to settle group balances.
The function takes a list of balances,
and return a list of settlements.
*/

export function settleDebts(balances: MemberBalance[]): Settlement[] {
  const settlements: Settlement[] = [];

  const creditors = [...balances]
    .filter((b) => b.balance > 0)
    .sort((a, b) => b.balance - a.balance);
  const debtors = [...balances]
    .filter((b) => b.balance < 0)
    .sort((a, b) => a.balance - b.balance);

  let i = 0,
    j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const amount = Math.min(-debtor.balance, creditor.balance);
    if (amount > 0) {
      settlements.push({
        from: debtor.userId,
        to: creditor.userId,
        amount,
      });

      debtor.balance += amount;
      creditor.balance -= amount;
    }

    if (Math.abs(debtor.balance) < 1e-6) i++; // consider settled
    if (creditor.balance < 1e-6) j++;
  }

  return settlements;
}

/*
The function that does the complete settlement.
It takes a list of transactions and a list of members,
and returns:
    total expense, 
    mean expense, 
    list of MemberBalances,
    list of settlements.
*/
export function calculateGroupSettlement(
    transactions: Transaction[],
    members: string[]
  ): {
    total: number;
    mean: number;
    balances: MemberBalance[];
    settlements: Settlement[];
  } {
    const { total, mean, balances } = prepareSettlement(transactions, members);
    const settlements = settleDebts(balances);
    return { total, mean, balances, settlements };
  }