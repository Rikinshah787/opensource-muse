import { Copy, Lightbulb, Rocket, Sparkles } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Button, Card, Chip, colors, Empty, SectionHeading, s } from "./ui";
import { useWorkspace } from "./workspace";

const angles = [
  {
    title: "Make it inspectable",
    detail: "Show the agent's plan, evidence, and next action before asking the user to trust it.",
    chip: "transparency",
  },
  {
    title: "Keep the human in the loop",
    detail: "Turn risky writes into reviewable drafts and receipts instead of invisible automation.",
    chip: "review",
  },
  {
    title: "Ship a useful sample",
    detail: "Make the local demo feel complete without requiring private accounts or paid services.",
    chip: "demo",
  },
];

export function StudioScreen() {
  const { ask, notify } = useWorkspace();
  const [brief, setBrief] = useState(
    "Turn this agent workspace into a memorable open-source project people can run locally.",
  );
  const [selected, setSelected] = useState(0);
  const prompt = useMemo(() => {
    const angle = angles[selected];
    return `Using this project brief: "${brief.trim()}". Explore the "${angle.title}" angle and propose a concrete next implementation step with acceptance criteria.`;
  }, [brief, selected]);
  return (
    <View style={{ gap: 20 }}>
      <Card style={{ backgroundColor: "#10191D", gap: 18 }}>
        <View style={[s.row, { gap: 8 }]}>
          <Sparkles size={15} color="#F7C95F" />
          <Text style={[s.label, { color: "#F7C95F" }]}>OpenSource Muse Studio</Text>
        </View>
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 30,
            lineHeight: 36,
            letterSpacing: -0.9,
            fontWeight: "600",
          }}
        >
          Turn rough project intent into a runnable agent task.
        </Text>
        <Text style={{ color: "#B8C4C8", fontSize: 14, lineHeight: 22, maxWidth: 560 }}>
          Capture the fork's direction, pick an angle, then send the shaped prompt into chat when
          it is ready for real work.
        </Text>
        <TextInput
          accessibilityLabel="Project brief"
          multiline
          value={brief}
          onChangeText={setBrief}
          placeholder="Describe the project direction"
          placeholderTextColor="#8C9AA0"
          style={[
            s.input,
            {
              minHeight: 112,
              textAlignVertical: "top",
              borderColor: "#2B3A3F",
              backgroundColor: "#172428",
              color: "#FFFFFF",
            },
          ]}
        />
        <View style={[s.row, { gap: 10, flexWrap: "wrap" }]}>
          <Button
            primary
            icon={Rocket}
            onPress={() => ask(prompt)}
            disabled={!brief.trim()}
            style={{ backgroundColor: "#F7C95F" }}
          >
            Send to chat
          </Button>
          <Button
            icon={Copy}
            onPress={() => {
              notify("Studio prompt ready to reuse.");
            }}
          >
            Mark reusable
          </Button>
        </View>
      </Card>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 14 }}>
        {angles.map((angle, index) => (
          <Pressable
            key={angle.title}
            accessibilityRole="button"
            accessibilityState={{ selected: selected === index }}
            onPress={() => setSelected(index)}
            style={{ flexGrow: 1, flexBasis: 220 }}
          >
            <Card
              style={{
                minHeight: 170,
                borderWidth: selected === index ? 2 : 1,
                borderColor: selected === index ? colors.blueDark : colors.line,
                gap: 10,
              }}
            >
              <View style={s.between}>
                <View style={s.iconBox}>
                  <Lightbulb size={18} color={colors.blueDark} />
                </View>
                <Chip tint={selected === index ? colors.blue : colors.canvas}>{angle.chip}</Chip>
              </View>
              <Text style={s.heading}>{angle.title}</Text>
              <Text style={s.muted}>{angle.detail}</Text>
            </Card>
          </Pressable>
        ))}
      </View>

      <Card>
        <SectionHeading title="Launch note" />
        {brief.trim() ? (
          <View style={{ gap: 12 }}>
            <Text style={s.text}>{prompt}</Text>
            <Text style={s.small}>
              This prompt is generated locally from the selected Studio angle. It does not send
              anything until you choose Send to chat.
            </Text>
          </View>
        ) : (
          <Empty
            icon={Lightbulb}
            title="Add a project brief"
            detail="Studio will turn it into a concrete agent prompt."
          />
        )}
      </Card>
    </View>
  );
}
