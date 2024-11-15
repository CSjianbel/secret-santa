"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmationModal } from "@/components/custom/confirmationModal";
import { Participant } from "@/app/types/participant";

export default function Home() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const addParticipant = () => {
    if (nickname && email) {
      setParticipants([...participants, { nickname, email }]);
      setNickname("");
      setEmail("");
    }
  };

  const assignAndSendEmails = async () => {
    setModalOpen(true);
    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    const assignments = shuffled.map((p, i) => ({
      giver: p,
      receiver: shuffled[(i + 1) % shuffled.length],
    }));

    try {
      await Promise.all(
        assignments.map(async ({ giver, receiver }) => {
          const response = await fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              giver,
              receiver,
            }),
          });

          const result = await response.json();
          if (result.success) {
            console.log("Email sent successfully");
          } else {
            console.log("Failed to send email:", result.message);
          }
        }),
      );
    } catch (error) {
      console.error("Error sending emails:", error);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setParticipants([]);
  };

  return (
    <div>
      <Card className="max-w-md mx-auto mt-20">
        <CardHeader className="text-center text-xl font-semibold">
          Secret Santa
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col">
            <Input
              placeholder="Nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="mb-2"
            />
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button onClick={addParticipant} className="mt-3">
              Add Participant
            </Button>
          </div>
          {participants.length > 0 && (
            <Table className="mt-5">
              <TableHeader>
                <TableRow>
                  <TableHead>Nickname</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.map((p, index) => (
                  <TableRow key={index}>
                    <TableCell>{p.nickname}</TableCell>
                    <TableCell>{p.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={assignAndSendEmails}
            disabled={participants.length < 2}
            className="w-full"
          >
            Assign and Send Emails
          </Button>
        </CardFooter>
      </Card>
      <ConfirmationModal isOpen={modalOpen} onClose={handleModalClose} />
    </div>
  );
}
