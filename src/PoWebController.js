import React, { useState } from 'react'
import { Page, StateProvider, Content, Spacer } from "rsi-react-web-components";
import "rsi-react-web-components/dist/index.css";

import { ContactVerification } from 'rsi-react-filipizen-components'

const initialState = {
  txntype: "po",
  txntypename: "Payment Order",
  refno: null,
  bill: {},
  contact: {},
}

const reducer = (draft, action) => {
  switch(action.type) {
    case "SET_BILL":
      draft.refno = action.refno;
      draft.bill = action.bill;
      return;

    case "SET_CONTACT":
      draft.contact = action.contact;
      return;
  }
}

import InitialInfo from "./InitialInfo";
import Payment from "./Payment";

const pages = [
  {step: 1, name: "verification", caption: "Verification", Component: ContactVerification},
  {step: 2, name: "initial", caption: "Initial Information", Component: InitialInfo},
  {step: 3, name: "payment", caption: "Payment", Component: Payment},
]

const PoWebController = ({
  partner,
  service,
  location,
  history,
  initialStep=0
}) => {

  const [step, setStep] = useState(initialStep);

  const moveNextStep = () => {
    setStep(cs => cs+1);
  }

  const movePrevStep = () => {
    if (step === 0) {
      history.goBack();
    } else {
      setStep(cs => cs-1);
    }
  }

  const cancelPayment = () => {
    setStep(1);
  }

  const page = pages[step];
  const PageComponent = page.Component;
  const compProps = {
    partner,
    service,
    location,
    history,
    moveNextStep,
    movePrevStep,
    cancelPayment,
    title: "Online Payment Order",
  };

  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <Page>
        <Content center>
          <PageComponent page={page} {...compProps} />
        </Content>
      </Page>
      <Spacer height={50} />
    </StateProvider>
  )
}

export default PoWebController
