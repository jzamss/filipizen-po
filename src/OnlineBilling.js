import React, { useState } from 'react'
import {
  Card,
  Text,
  Button,
  FormPanel,
  ActionBar,
  Spacer,
  Table,
  TableColumn,
  Subtitle,
  Title,
  currencyFormat,
  BackLink,
  useData,
  Panel,
  Label
} from 'rsi-react-web-components'

const origin = 'filipizen'

const OnlineBilling = ({
  title,
  partner,
  onCancel,
  onSubmit,
}) => {
  const [ctx ] = useData();
  const { refno, txntype, txntypename, contact, bill: initialBill } = ctx;
  const [bill, setBill] = useState(initialBill);

  const checkoutPayment = () => {
    const po = { ...bill };
    const items = po.items;
    delete po.items;

    onSubmit({
      refno,
      txntype,
      txntypename,
      origin,
      orgcode: partner.id,
      paidby: bill.paidby,
      paidbyaddress: bill.paidbyaddress,
      amount: bill.amount,
      particulars: `Payment Order ${refno} Payment for: ${po.particulars}`,
      items: items,
      info: {data: po},
    })
  }

  const onCancelBilling = () => {
    onCancel(0);
  }

  return (
    <Card>
      <Title>{title}</Title>
      <Subtitle>Payment Order Information</Subtitle>
      <Spacer />
      <Panel style={{minWidth: 350}}/>
      <FormPanel context={bill} handler={setBill}>
        <Text name='txnno' caption='PO No.' readOnly />
        <Text name='txndate' caption='PO Date' readOnly />
        <Text name='billto' caption='Bill To:' readOnly />
        <Text name='billtoaddress' caption='Address' readOnly />
        <Spacer />
        <Table items={bill ? bill.items : []} size="small" showPagination={false} >
          <TableColumn caption="Account" expr={item => item.item.title} />
          <TableColumn caption="Amount" expr="amount" align="right" format="currency" />
        </Table>
        <Panel style={{display: "flex", flexDirection: "row", justifyContent: "flex-end", paddingRight: 15}}>
          <Label context={bill} caption="Amount Due:" expr={item => currencyFormat(item.amount)} />
        </Panel>
      </FormPanel>
      <ActionBar>
        <BackLink caption='Back' action={onCancelBilling} />
        <Button caption='Confirm Payment' action={checkoutPayment} disableWhen={bill.amount === 0} />
      </ActionBar>
    </Card>
  )
}

export default OnlineBilling
