import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { TabTrigger } from "@/components/shared/tab-trigger";
import { Deposit } from "./deposit";
import { Mint } from "./mint";
import { Redeem } from "./redeem";
import { Withdraw } from "./withdraw";

export function Earn() {
  return (
    <div className="flex h-full mt-10 justify-center">
      <Card className="w-full max-w-2xl overflow-hidden border-0 shadow-xl gap-0">
        <Tabs defaultValue="deposit" className="w-full">
          <TabsList className="w-full rounded-none h-14 grid grid-cols-4">
            <TabTrigger value="deposit">Deposit</TabTrigger>
            <TabTrigger value="mint">Mint</TabTrigger>
            <TabTrigger value="redeem">Redeem</TabTrigger>
            <TabTrigger value="withdraw">Withdraw</TabTrigger>
          </TabsList>
          <TabsContent value="deposit" className="mt-0">
            <Deposit />
          </TabsContent>
          <TabsContent value="mint" className="mt-0">
            <Mint />
          </TabsContent>
          <TabsContent value="redeem" className="mt-0">
            <Redeem />
          </TabsContent>
          <TabsContent value="withdraw" className="mt-0">
            <Withdraw />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
