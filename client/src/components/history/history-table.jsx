import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const HistoryTable = ({ history }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className=" text-lg">Date Checked</TableHead>
          <TableHead className="text-right text-lg">Eligible Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {history.map((historyItem, index) => (
          <TableRow key={"history-" + index}>
            <TableCell className="font-medium text-lg">
              {new Date(historyItem.date).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right text-lg">
              {historyItem.eligibleAmount.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default HistoryTable;
