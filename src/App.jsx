
import { useRef, useState } from "react";
import "./App.css";

const log = (...args) => console.log(
  `[TB21 ${new Date().toISOString()}]`,
  ...args
);

export default function App() {
  const [deviceName, setDeviceName] = useState("");
  const [status, setStatus] = useState("Not connected");
  const [services, setServices] = useState([]);
  const [busy, setBusy] = useState(false);
  const deviceRef = useRef(null);
  const serverRef = useRef(null);

  const supported =
    typeof navigator !== "undefined" &&
    !!navigator.bluetooth;

  async function scanAndConnect() {
    if (!supported) {
      log("ERROR: Web Bluetooth unavailable", {
        secureContext: window.isSecureContext,
        userAgent: navigator.userAgent,
      });
      setStatus("Use Chrome in a secure context");
      return;
    }

    setBusy(true);
    setServices([]);
    log("Starting BLE device selection");

    try {
      // No guessed service UUIDs: let the user select the device.
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          "generic_access",
          "generic_attribute",
          "battery_service",
        ],
      });

      deviceRef.current = device;
      setDeviceName(device.name || "(unnamed device)");

      log("Device selected", {
        name: device.name,
        id: device.id,
        gattConnected: device.gatt?.connected,
      });

      device.addEventListener("gattserverdisconnected", () => {
        log("GATT disconnected", device.name);
        setStatus("Disconnected");
        setServices([]);
      });

      setStatus("Connecting…");
      const server = await device.gatt.connect();
      serverRef.current = server;

      log("GATT connected", {
        connected: server.connected,
      });
      setStatus("Connected; discovering services…");

      const discovered = await server.getPrimaryServices();

      log("Primary services discovered", discovered.length);

      const result = [];

      for (const service of discovered) {
        log("Service", service.uuid);

        const characteristics =
          await service.getCharacteristics();

        const chars = [];

        for (const ch of characteristics) {
          const info = {
            uuid: ch.uuid,
            properties: {
              read: ch.properties.read,
              write: ch.properties.write,
              writeWithoutResponse:
                ch.properties.writeWithoutResponse,
              notify: ch.properties.notify,
              indicate: ch.properties.indicate,
            },
          };

          log("Characteristic", info);
          chars.push(info);

          // Subscribe only to characteristics that explicitly
          // advertise notification support.
          if (ch.properties.notify) {
            try {
              await ch.startNotifications();
              ch.addEventListener(
                "characteristicvaluechanged",
                (event) => {
                  const value =
                    event.target.value;
                  const bytes = Array.from(
                    new Uint8Array(
                      value.buffer,
                      value.byteOffset,
                      value.byteLength
                    )
                  );

                  log("Notification received", {
                    service: service.uuid,
                    characteristic: ch.uuid,
                    bytes,
                    hex: bytes.map(
                      (b) => b.toString(16).padStart(2, "0")
                    ).join(" "),
                  });
                }
              );
              log("Notifications enabled", ch.uuid);
            } catch (error) {
              log("Notification setup failed", {
                uuid: ch.uuid,
                error: error.message,
              });
            }
          }
        }

        result.push({
          uuid: service.uuid,
          characteristics: chars,
        });
      }

      setServices(result);
      setStatus(
        `Connected — found ${result.length} services`
      );
      log("Discovery complete", result);
    } catch (error) {
      log("Bluetooth operation failed", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
      setStatus(`${error.name}: ${error.message}`);
    } finally {
      setBusy(false);
    }
  }

  async function readCharacteristic(serviceUUID, charUUID) {
    try {
      const device = deviceRef.current;
      if (!device?.gatt?.connected) {
        throw new Error("Connect to the device first");
      }

      const service =
        await serverRef.current.getPrimaryService(
          serviceUUID
        );
      const characteristic =
        await service.getCharacteristic(charUUID);

      if (!characteristic.properties.read) {
        throw new Error("Characteristic is not readable");
      }

      const value = await characteristic.readValue();
      const bytes = Array.from(
        new Uint8Array(
          value.buffer,
          value.byteOffset,
          value.byteLength
        )
      );

      log("Read successful", {
        serviceUUID,
        charUUID,
        bytes,
      });
    } catch (error) {
      log("Read failed", error);
      setStatus(error.message);
    }
  }

  function disconnect() {
    log("Disconnect requested");
    if (deviceRef.current?.gatt?.connected) {
      deviceRef.current.gatt.disconnect();
    }
    serverRef.current = null;
    setServices([]);
    setStatus("Disconnected");
  }

  return (
    <main className="app">
      <header>
        <p className="eyebrow">BLUETOOTH LAB</p>
        <h1>TB-21 Controller</h1>
        <p>BLE discovery and protocol diagnostics</p>
      </header>

      <section className="panel">
        <div className="status">
          <span className="dot" />
          <span>{status}</span>
        </div>

        <p>Device: {deviceName || "Not selected"}</p>
        <p className="muted">
          Secure context:{" "}
          {String(
            typeof window !== "undefined" &&
            window.isSecureContext
          )}
        </p>

        <button
          onClick={scanAndConnect}
          disabled={busy}
        >
          {busy ? "Working…" : "Scan & Connect"}
        </button>

        <button
          className="secondary"
          onClick={disconnect}
        >
          Disconnect
        </button>
      </section>

      <section className="panel">
        <h2>Volume test</h2>
        <p className="muted">
          Volume commands are disabled until we identify
          the device protocol and correct command format.
        </p>

        <div className="volume-controls">
          <button disabled>− Volume</button>
          <button disabled>+ Volume</button>
        </div>
      </section>

      <section className="panel">
        <h2>GATT services</h2>

        {services.length === 0 && (
          <p className="muted">
            Connect to inspect discovered services.
          </p>
        )}

        {services.map((service) => (
          <article className="service" key={service.uuid}>
            <strong>{service.uuid}</strong>

            {service.characteristics.map((ch) => (
              <div className="characteristic" key={ch.uuid}>
                <code>{ch.uuid}</code>
                <p>
                  {Object.entries(ch.properties)
                    .filter(([, enabled]) => enabled)
                    .map(([name]) => name)
                    .join(", ") || "No exposed properties"}
                </p>

                {ch.properties.read && (
                  <button
                    className="secondary"
                    onClick={() =>
                      readCharacteristic(
                        service.uuid,
                        ch.uuid
                      )
                    }
                  >
                    Read value
                  </button>
                )}
              </div>
            ))}
          </article>
        ))}
      </section>

      <p className="footer">
        Open DevTools → Console on desktop to inspect logs.
        On Android, use remote debugging from desktop Chrome.
      </p>
    </main>
  );
}
