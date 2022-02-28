import React, { useState } from "react";
import {
  Text,
  Title,
  Button,
  ActionBar,
  Subtitle,
  Spacer,
  Service,
  Error,
  BackLink,
  useData,
  Integer,
  Panel,
  Card
} from "rsi-react-web-components";

const InitialInfo = ({ title, partner, moveNextStep, movePrevStep }) => {
  const [ctx, dispatch] = useData();
  const { txntype } = ctx;

  const [error, setError] = useState();
  const [processing, setProcessing] = useState(false);
  const [refno, setRefno] = useState("");

  const loadBill = () => {
    setProcessing(true);
    setError(null);
    const svc = Service.lookup(`${partner.channelid}:OnlinePoService`, "po");
    svc.invoke("getBilling", { txntype, refno }, (err, po) => {
      if (err) {
        setError(
          "An internal error is encountered. Please try again later or contact LGU for assistance."
        );
      } else {
        dispatch({ type: "SET_BILL", refno: refno, bill: po });
        setError(null);
        moveNextStep();
      }
      setProcessing(false);
    });
  };

  return (
    <React.Fragment>
      <Card>
        <Title>{title}</Title>
        <Subtitle>Initial Information</Subtitle>
        <Spacer />
        <Error msg={error} />
        <Panel>
          <Text
            caption="Payment Order No."
            name="refno"
            value={refno}
            onChange={setRefno}
            readOnly={processing}
            autoFocus={true}
            required={true}
          />
        </Panel>
        <ActionBar>
          <BackLink caption="Cancel" variant="text" action={movePrevStep} />
          <Button
            caption="Next"
            action={loadBill}
            processing={processing}
            disableWhen={
              processing || !refno || refno.trim().length === 0 ? true : false
            }
          />
        </ActionBar>
      </Card>
    </React.Fragment>
  );
};

export default InitialInfo;
